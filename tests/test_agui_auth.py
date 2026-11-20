"""Web login: LDAP password check, signed session tokens, and the AG-UI endpoints."""

from __future__ import annotations

from types import SimpleNamespace

import pytest

pytest.importorskip("fastapi")
pytest.importorskip("ldap3")

from fastapi.testclient import TestClient  # noqa: E402

import agui_auth  # noqa: E402
import agui_server  # noqa: E402
from settings.server_config import AuthConfig  # noqa: E402

SECRET = "s" * 40


@pytest.fixture
def cfg(monkeypatch) -> AuthConfig:
    config = AuthConfig(
        enabled=True,
        ldap_url="ldap://ldap.test:389",
        user_dn_template="uid={username},ou=people,dc=test",
        session_hours=1,
    )
    monkeypatch.setenv(config.session_secret_env, SECRET)
    monkeypatch.setattr(agui_auth, "auth_config", lambda: config)
    monkeypatch.setattr(agui_server, "auth_config", lambda: config)
    return config


# --------------------------------------------------------------------- tokens


def test_token_round_trip(cfg):
    token, session = agui_auth.issue_token("alice", cfg, now=1000)
    assert session.expires_at == 1000 + 3600
    assert agui_auth.verify_token(token, cfg, now=2000).user == "alice"


def test_tampered_token_rejected(cfg):
    token, _ = agui_auth.issue_token("alice", cfg)
    other, _ = agui_auth.issue_token("mallory", cfg)
    forged = other.split(".")[0] + "." + token.split(".")[1]
    with pytest.raises(agui_auth.AuthError):
        agui_auth.verify_token(forged, cfg)
    with pytest.raises(agui_auth.AuthError):
        agui_auth.verify_token("garbage", cfg)


def test_expired_token_rejected(cfg):
    token, _ = agui_auth.issue_token("alice", cfg, now=0)
    with pytest.raises(agui_auth.AuthError, match="expired"):
        agui_auth.verify_token(token, cfg, now=3601)


def test_token_from_another_key_rejected(cfg, monkeypatch):
    token, _ = agui_auth.issue_token("alice", cfg)
    monkeypatch.setenv(cfg.session_secret_env, "t" * 40)
    with pytest.raises(agui_auth.AuthError):
        agui_auth.verify_token(token, cfg)


def test_short_secret_is_a_setup_error(cfg, monkeypatch):
    monkeypatch.setenv(cfg.session_secret_env, "short")
    with pytest.raises(RuntimeError, match="TAHOEPILOT_SESSION_SECRET"):
        agui_auth.issue_token("alice", cfg)


def test_user_from_request_needs_bearer(cfg):
    token, _ = agui_auth.issue_token("alice", cfg)
    assert agui_auth.user_from_request({"authorization": f"Bearer {token}"}, cfg) == "alice"
    with pytest.raises(agui_auth.AuthError):
        agui_auth.user_from_request({}, cfg)
    with pytest.raises(agui_auth.AuthError):
        agui_auth.user_from_request({"authorization": f"Basic {token}"}, cfg)


# ----------------------------------------------------------------------- LDAP


class _FakeConnection:
    accept = {("uid=alice,ou=people,dc=test", "right")}
    seen: list[tuple[str, str]] = []

    def __init__(self, server, *, user, password, **_kwargs):
        self.user, self.password = user, password
        self.result = {"description": "invalidCredentials"}

    def open(self):
        pass

    def start_tls(self):
        pass

    def bind(self):
        _FakeConnection.seen.append((self.user, self.password))
        return (self.user, self.password) in self.accept

    def unbind(self):
        pass


@pytest.fixture
def fake_ldap(monkeypatch):
    import ldap3

    _FakeConnection.seen = []
    monkeypatch.setattr(ldap3, "Connection", _FakeConnection)
    return _FakeConnection


def test_ldap_accepts_right_password(cfg, fake_ldap):
    token, session = agui_auth.login(" alice ", "right", cfg)
    assert session.user == "alice"
    assert agui_auth.verify_token(token, cfg).user == "alice"


def test_ldap_rejects_wrong_password(cfg, fake_ldap):
    with pytest.raises(agui_auth.AuthError):
        agui_auth.login("alice", "wrong", cfg)


def test_empty_password_never_reaches_ldap(cfg, fake_ldap):
    # A DN with an empty password is an anonymous bind, which LDAP accepts.
    with pytest.raises(agui_auth.AuthError):
        agui_auth.login("alice", "", cfg)
    assert fake_ldap.seen == []


@pytest.mark.parametrize("name", ["", "a,b", "x)(uid=*", "a b", "x" * 129])
def test_bad_usernames_never_reach_ldap(cfg, fake_ldap, name):
    with pytest.raises(agui_auth.AuthError):
        agui_auth.login(name, "right", cfg)
    assert fake_ldap.seen == []


def test_user_dn_template(cfg):
    assert agui_auth.user_dn("alice", cfg) == "uid=alice,ou=people,dc=test"
    upn = cfg.model_copy(update={"user_dn_template": "{username}@example.com"})
    assert agui_auth.user_dn("alice", upn) == "alice@example.com"


# ------------------------------------------------------------------ endpoints


@pytest.fixture
def client(monkeypatch):
    app = agui_server.app
    previous = getattr(app.state, "runtimes", None)
    app.state.runtimes = agui_server.make_runtimes()  # graphs never built (no_lifespan)
    try:
        with TestClient(app, raise_server_exceptions=True) as c:
            yield c
    finally:
        app.state.runtimes = previous


@pytest.fixture
def no_lifespan(monkeypatch):
    # Skip graph building in the app lifespan.
    monkeypatch.setattr(agui_server.AguiRuntime, "ensure_built", lambda self: _noop())


async def _noop():
    return None


def test_login_endpoint(cfg, fake_ldap, no_lifespan, client):
    ok = client.post("/agui/auth/login", json={"username": "alice", "password": "right"})
    assert ok.status_code == 200
    body = ok.json()
    assert body["user"] == "alice" and body["token"]
    me = client.get("/agui/auth/me", headers={"Authorization": f"Bearer {body['token']}"})
    assert me.json() == {"user": "alice", "auth": True}

    bad = client.post("/agui/auth/login", json={"username": "alice", "password": "wrong"})
    assert bad.status_code == 401
    assert client.get("/agui/auth/me").status_code == 401


def test_login_endpoint_disabled(monkeypatch, no_lifespan, client):
    off = AuthConfig(enabled=False)
    monkeypatch.setattr(agui_server, "auth_config", lambda: off)
    assert client.post("/agui/auth/login", json={"username": "a", "password": "b"}).status_code == 404
    assert client.get("/agui/auth/me").json() == {"user": None, "auth": False}


def test_agui_run_requires_session_when_login_on(cfg, no_lifespan, client):
    payload = {
        "threadId": "t", "runId": "r", "state": {}, "messages": [], "tools": [],
        "context": [], "forwardedProps": {},
    }
    response = client.post("/agui/lead", json=payload)
    assert response.status_code == 401
    actions = client.post("/agui/databot/actions", json={"thread_id": "t", "action": "propose_sql"})
    assert actions.status_code == 401


@pytest.mark.asyncio
async def test_signed_in_user_beats_user_header(cfg):
    token, _ = agui_auth.issue_token("alice", cfg)
    request = SimpleNamespace(
        headers={"authorization": f"Bearer {token}", agui_server.USER_HEADER: "mallory"}
    )
    assert await agui_server._request_user_id(request, SimpleNamespace(graph=None), "t") == "alice"


@pytest.mark.asyncio
async def test_missing_session_is_401(cfg):
    from fastapi import HTTPException

    request = SimpleNamespace(headers={agui_server.USER_HEADER: "mallory"})
    with pytest.raises(HTTPException) as info:
        await agui_server._request_user_id(request, SimpleNamespace(graph=None), "t")
    assert info.value.status_code == 401


# ------------------------------------------------------- search-then-bind (AD)

SERVICE = "svc@ad.test"
ALICE_DN = "CN=Alice Smith,OU=Users,DC=ad,DC=test"


class _FakeAdConnection:
    """Directory with a service account and one user found by sAMAccountName."""

    seen: list[tuple[str, str]] = []
    searches: list[tuple[str, str]] = []

    def __init__(self, server, *, user, password, **_kwargs):
        self.user, self.password = user, password
        self.result = {"description": "invalidCredentials"}
        self.response: list[dict] = []

    def open(self):
        pass

    def start_tls(self):
        pass

    def bind(self):
        _FakeAdConnection.seen.append((self.user, self.password))
        return (self.user, self.password) in {(SERVICE, "svc-pw"), (ALICE_DN, "right")}

    def search(self, base, query, **_kwargs):
        _FakeAdConnection.searches.append((base, query))
        if "sAMAccountName=alice)" in query:
            self.response = [{"type": "searchResEntry", "dn": ALICE_DN}]

    def unbind(self):
        pass


@pytest.fixture
def ad_cfg(cfg, monkeypatch):
    import ldap3

    _FakeAdConnection.seen, _FakeAdConnection.searches = [], []
    monkeypatch.setattr(ldap3, "Connection", _FakeAdConnection)
    monkeypatch.setenv("LDAP_BIND_PASSWORD", "svc-pw")
    return cfg.model_copy(
        update={
            "user_dn_template": "",
            "user_base_dn": "OU=Users,DC=ad,DC=test",
            "user_search_filter": "(&(objectClass=person)(sAMAccountName={username}))",
            "bind_user": SERVICE,
        }
    )


def test_search_then_bind(ad_cfg):
    token, session = agui_auth.login("alice", "right", ad_cfg)
    assert session.user == "alice"  # the username is kept, not the DN
    assert _FakeAdConnection.searches == [
        ("OU=Users,DC=ad,DC=test", "(&(objectClass=person)(sAMAccountName=alice))")
    ]
    assert _FakeAdConnection.seen == [(SERVICE, "svc-pw"), (ALICE_DN, "right")]


def test_search_then_bind_wrong_password(ad_cfg):
    with pytest.raises(agui_auth.AuthError):
        agui_auth.login("alice", "wrong", ad_cfg)


def test_search_unknown_user(ad_cfg):
    with pytest.raises(agui_auth.AuthError):
        agui_auth.login("bob", "right", ad_cfg)
    assert [user for user, _ in _FakeAdConnection.seen] == [SERVICE]  # no user bind


def test_search_filter_is_escaped(ad_cfg):
    # "*" would match every account; it must reach LDAP escaped (and here the
    # username pattern already refuses it).
    with pytest.raises(agui_auth.AuthError):
        agui_auth.login("*", "right", ad_cfg)
    assert _FakeAdConnection.searches == []


def test_rejected_service_account_is_a_server_problem(ad_cfg, monkeypatch):
    monkeypatch.setenv("LDAP_BIND_PASSWORD", "stale")
    with pytest.raises(agui_auth.DirectoryUnavailable):
        agui_auth.login("alice", "right", ad_cfg)


def test_missing_service_password_is_a_setup_error(ad_cfg, monkeypatch):
    monkeypatch.delenv("LDAP_BIND_PASSWORD")
    with pytest.raises(RuntimeError, match="LDAP_BIND_PASSWORD"):
        agui_auth.login("alice", "right", ad_cfg)


# ------------------------------------------------- dev: skip the password check


def test_skip_password_check_accepts_any_password(cfg, fake_ldap):
    dev = cfg.model_copy(update={"skip_password_check": True})
    token, session = agui_auth.login(" alice ", "anything", dev)
    assert session.user == "alice"
    assert agui_auth.verify_token(token, dev).user == "alice"
    assert fake_ldap.seen == []  # LDAP never contacted


def test_skip_password_check_still_validates_username(cfg, fake_ldap):
    dev = cfg.model_copy(update={"skip_password_check": True})
    with pytest.raises(agui_auth.AuthError):
        agui_auth.login("a,b", "anything", dev)
