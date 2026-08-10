import logging
import os

from kubernetes import client, config, watch
from kubernetes.client.models import V1Pod
from kubernetes.config import ConfigException

log = logging.getLogger(__name__)

DEFAULT_K8S_CONFIG_FILE = "./k8s_config"

class K8sHelper:
    """
    available namespace in tahoe
    - presto -> trino deployment
    - spark -> spark deployment
    - flink -> flink deployment
    - hive -> hive standalone metastore deployment
    - airflow -> airflow deployment
    - superset -> superset deployment
    - tableau -> tableau deployment
    - datahub - datahub deployment
    """
    DEFAULT_NAMESPACE = "default"

    def __init__(self, config_file: str = '/tmp/k8s_config') -> None:
        self.in_cluster = False
        self.config_file = config_file
        self.api = self.api_client()
        self.v1 = client.CoreV1Api(api_client=self.api)
        self.custom_obj_api = client.CustomObjectsApi(self.api)

    def api_client(self) -> client.ApiClient:
        config.load_kube_config(self.config_file)
        api_client = client.ApiClient()
        try:
            v1 = client.CoreV1Api(api_client)
            v1.get_api_resources()
            self.in_cluster = False
        except Exception as e:
            log.warning("Out-of-cluster config unusable: %s", str(e))
            if os.path.exists(self.config_file):
                log.warning("Deleting unusable kubeconfig file: %s", self.config_file)
                os.remove(self.config_file)
            raise
        return api_client

    def list_namespaced_pod(
        self,
        label_selector: str = "",
        namespace: str = None,
        **kwargs,
    ) -> client.V1PodList:
        """
        Retrieves a list of Kind pod which belong default kubernetes namespace
        :param label_selector: A selector to restrict the list of returned objects by their labels
        :param namespace: kubernetes namespace
        """
        return self.v1.list_namespaced_pod(
            namespace=namespace or self.DEFAULT_NAMESPACE,
            watch=False,
            label_selector=label_selector,
            **kwargs,
        )

    def read_namespaced_pod(self, name: str, namespace: str) -> V1Pod:
        return self.v1.read_namespaced_pod(
            name=name,
            namespace=namespace,
        )

    def read_namespaced_pod_log(self, name: str, container: str, namespace: str) -> str:
        """
        Retrieves a container's log from the specified pod.

        :param pod_name: pod name
        :param container: container name
        :param namespace: kubernetes namespace
        """
        return self.v1.read_namespaced_pod_log(
            name=name,
            container=container,
            namespace=namespace or self.DEFAULT_NAMESPACE,
        )


    # Watch on custom object is not supported yet
    # https://github.com/kubernetes-client/python/issues/1679
    # https://github.com/kubernetes-client/python/issues/868
    def get_namespaced_custom_object(
            self, group: str, version: str, plural: str, name: str, namespace: str = None
        ):
        """
        Get custom resource definition object from Kubernetes

        :param group: api group
        :param version: api version
        :param plural: api plural
        :param name: crd object name
        :param namespace: kubernetes namespace
        """
        namespace = namespace or self.DEFAULT_NAMESPACE
        try:
            response = self.custom_obj_api.get_namespaced_custom_object(
                group=group,
                version=version,
                namespace=namespace,
                plural=plural,
                name=name,
            )
            return response
        except client.rest.ApiException as e:
            raise e

    def list_namespaced_custom_object(
            self, group: str, version: str, plural: str, namespace: str = None
    ):
        """
        :param group: api group
        :param version: api version
        :param plural: api plural
        :param namespace: kubernetes namespace
        """
        try:
            response = self.custom_obj_api.list_namespaced_custom_object(
                group=group,
                version=version,
                namespace=namespace,
                plural=plural)
            return response
        except client.rest.ApiException as e:
            raise e

k8s_helper = K8sHelper(config_file=DEFAULT_K8S_CONFIG_FILE)

TOOLS = [
    k8s_helper.list_namespaced_pod,
    k8s_helper.read_namespaced_pod,
    k8s_helper.read_namespaced_pod_log,
    k8s_helper.get_namespaced_custom_object,
    k8s_helper.list_namespaced_custom_object
]