(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-2E4U76K2.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adjustClustersAndEdges",
    ()=>adjustClustersAndEdges,
    "clearLayoutRenderState",
    ()=>clearLayoutRenderState,
    "clusterDb",
    ()=>clusterDb,
    "createCommonLayoutRenderer",
    ()=>createCommonLayoutRenderer,
    "createLayoutElementGroups",
    ()=>createLayoutElementGroups,
    "defaultMeasureLayout",
    ()=>defaultMeasureLayout,
    "findNonClusterChild",
    ()=>findNonClusterChild,
    "insertMeasuredNode",
    ()=>insertMeasuredNode,
    "paintLayoutData",
    ()=>paintLayoutData,
    "sortNodesByHierarchy",
    ()=>sortNodesByHierarchy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$L3NEJ4N5$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-L3NEJ4N5.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$OSK3NFVY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-OSK3NFVY.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$GVQU2GXP$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-GVQU2GXP.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$4HAMMTFA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-4HAMMTFA.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$75Z2AOVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-75Z2AOVW.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-DU6HZSFF.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-X3CZISLH.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-Y2CYZVJY.mjs [app-client] (ecmascript)");
// src/rendering-util/createGraph.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dagre$2d$d3$2d$es$2f$src$2f$graphlib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/dagre-d3-es/src/graphlib/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dagre$2d$d3$2d$es$2f$src$2f$graphlib$2f$graph$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/dagre-d3-es/src/graphlib/graph.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
function createLayoutElementGroups(element, { edgePathsClass = "edges edgePaths" } = {}) {
    const rootGroups = element.insert("g").attr("class", "root");
    const clusters = rootGroups.insert("g").attr("class", "clusters");
    const edgePaths = rootGroups.insert("g").attr("class", edgePathsClass);
    const edgeLabels2 = rootGroups.insert("g").attr("class", "edgeLabels");
    const nodes = rootGroups.insert("g").attr("class", "nodes");
    return {
        clusters,
        edgePaths,
        edgeLabels: edgeLabels2,
        nodes,
        rootGroups
    };
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(createLayoutElementGroups, "createLayoutElementGroups");
async function measureGroupLabel(nodesGroup, node) {
    if (node.label) {
        const { shapeSvg, bbox } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$4HAMMTFA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["labelHelper"])(nodesGroup, node);
        node.labelBBox = {
            width: bbox.width,
            height: bbox.height
        };
        shapeSvg.remove();
    } else {
        node.labelBBox = {
            width: 0,
            height: 0
        };
    }
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(measureGroupLabel, "measureGroupLabel");
async function insertMeasuredNode(nodesGroup, node, renderOptions) {
    const childNodeEl = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$GVQU2GXP$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["insertNode"])(nodesGroup, node, renderOptions);
    const boundingBox = childNodeEl.node()?.getBBox() ?? {
        width: 0,
        height: 0
    };
    node.width = boundingBox.width;
    node.height = boundingBox.height;
    return childNodeEl;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(insertMeasuredNode, "insertMeasuredNode");
async function createGraphWithElements(element, data4Layout) {
    const graph = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dagre$2d$d3$2d$es$2f$src$2f$graphlib$2f$graph$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Graph"]({
        multigraph: true,
        compound: true
    });
    const edgesToProcess = [
        ...data4Layout.edges
    ];
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig2"])();
    const groups = createLayoutElementGroups(element);
    const { edgeLabels: edgeLabels2, nodes: nodesGroup } = groups;
    const nodeElements = /* @__PURE__ */ new Map();
    const hasDom = element.node() != null;
    await Promise.all(data4Layout.nodes.map(async (node)=>{
        if (node.isGroup) {
            if (hasDom) {
                await measureGroupLabel(nodesGroup, node);
            }
            graph.setNode(node.id, {
                ...node
            });
        } else {
            if (hasDom) {
                const childNodeEl = await insertMeasuredNode(nodesGroup, node, {
                    config,
                    dir: node.dir
                });
                nodeElements.set(node.id, childNodeEl);
            }
            graph.setNode(node.id, {
                ...node
            });
        }
    }));
    for (const edge of edgesToProcess){
        if (hasDom && (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$OSK3NFVY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasEdgeLabel"])(edge)) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$OSK3NFVY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["insertEdgeLabel"])(edgeLabels2, edge);
        }
        graph.setEdge(edge.start, edge.end, {
            ...edge
        }, edge.id);
        const edgeExists = data4Layout.edges.some((existingEdge)=>existingEdge.id === edge.id);
        if (!edgeExists) {
            data4Layout.edges.push(edge);
        }
    }
    if (globalThis.mermaidCaptureSizes) {
        const { captureNodeSizes } = await __turbopack_context__.A("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/sizeCapture-INFHLROL.mjs [app-client] (ecmascript, async loader)");
        captureNodeSizes(element, data4Layout);
    }
    return {
        graph,
        groups,
        nodeElements
    };
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(createGraphWithElements, "createGraphWithElements");
;
var clusterDb = /* @__PURE__ */ new Map();
var descendants = /* @__PURE__ */ new Map();
var parents = /* @__PURE__ */ new Map();
var clear4 = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>{
    descendants.clear();
    parents.clear();
    clusterDb.clear();
}, "clear");
var isDescendant = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((id, ancestorId)=>{
    const ancestorDescendants = descendants.get(ancestorId) || [];
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].trace("In isDescendant", ancestorId, " ", id, " = ", ancestorDescendants.includes(id));
    return ancestorDescendants.includes(id);
}, "isDescendant");
var edgeInCluster = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((edge, clusterId)=>{
    const clusterDescendants = descendants.get(clusterId) || [];
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].info("Descendants of ", clusterId, " is ", clusterDescendants);
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].info("Edge is ", edge);
    if (edge.v === clusterId || edge.w === clusterId) {
        return false;
    }
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return clusterDescendants.includes(edge.v) || isDescendant(edge.v, clusterId) || isDescendant(edge.w, clusterId) || clusterDescendants.includes(edge.w);
}, "edgeInCluster");
var copy = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((clusterId, graph, newGraph, rootId)=>{
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Copying children of ", clusterId, "root", rootId, "data", graph.node(clusterId), rootId);
    const nodes = graph.children(clusterId) || [];
    if (clusterId !== rootId) {
        nodes.push(clusterId);
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Copying (nodes) clusterId", clusterId, "nodes", nodes);
    nodes.forEach((node)=>{
        if (graph.children(node).length > 0) {
            copy(node, graph, newGraph, rootId);
        } else {
            const data = graph.node(node);
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].info("cp ", node, " to ", rootId, " with parent ", clusterId);
            newGraph.setNode(node, data);
            if (rootId !== graph.parent(node)) {
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Setting parent", node, graph.parent(node));
                newGraph.setParent(node, graph.parent(node));
            }
            if (clusterId !== rootId && node !== clusterId) {
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Setting parent", node, clusterId);
                newGraph.setParent(node, clusterId);
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].info("In copy ", clusterId, "root", rootId, "data", graph.node(clusterId), rootId);
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Not Setting parent for node=", node, "cluster!==rootId", clusterId !== rootId, "node!==clusterId", node !== clusterId);
            }
            const edges = graph.edges(node);
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Copying Edges", edges);
            edges.forEach((edge)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].info("Edge", edge);
                const data2 = graph.edge(edge.v, edge.w, edge.name);
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].info("Edge data", data2, rootId);
                try {
                    if (edgeInCluster(edge, rootId)) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].info("Copying as ", edge.v, edge.w, data2, edge.name);
                        newGraph.setEdge(edge.v, edge.w, data2, edge.name);
                        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].info("newGraph edges ", newGraph.edges(), newGraph.edge(newGraph.edges()[0]));
                    } else {
                        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].info("Skipping copy of edge ", edge.v, "-->", edge.w, " rootId: ", rootId, " clusterId:", clusterId);
                    }
                } catch (e) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].error(e);
                }
            });
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Removing node", node);
        graph.removeNode(node);
    });
}, "copy");
var extractDescendants = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((id, graph)=>{
    const children = graph.children(id);
    let res = [
        ...children
    ];
    for (const child of children){
        parents.set(child, id);
        res = [
            ...res,
            ...extractDescendants(child, graph)
        ];
    }
    return res;
}, "extractDescendants");
var findCommonEdges = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((graph, id1, id2)=>{
    const edges1 = graph.edges().filter((edge)=>edge.v === id1 || edge.w === id1);
    const edges2 = graph.edges().filter((edge)=>edge.v === id2 || edge.w === id2);
    const edges1Prim = edges1.map((edge)=>{
        return {
            v: edge.v === id1 ? id2 : edge.v,
            w: edge.w === id1 ? id1 : edge.w
        };
    });
    const edges2Prim = edges2.map((edge)=>{
        return {
            v: edge.v,
            w: edge.w
        };
    });
    const result = edges1Prim.filter((edgeIn1)=>{
        return edges2Prim.some((edge)=>edgeIn1.v === edge.v && edgeIn1.w === edge.w);
    });
    return result;
}, "findCommonEdges");
var findNonClusterChild = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((id, graph, clusterId)=>{
    const children = graph.children(id);
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].trace("Searching children of id ", id, children);
    if (children.length < 1) {
        return id;
    }
    let reserve;
    for (const child of children){
        const _id = findNonClusterChild(child, graph, clusterId);
        const commonEdges = findCommonEdges(graph, clusterId, _id);
        if (_id) {
            if (commonEdges.length > 0) {
                reserve = _id;
            } else {
                return _id;
            }
        }
    }
    return reserve;
}, "findNonClusterChild");
var getAnchorId = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((id)=>{
    if (!clusterDb.has(id)) {
        return id;
    }
    if (!clusterDb.get(id).externalConnections) {
        return id;
    }
    if (clusterDb.has(id)) {
        return clusterDb.get(id).id;
    }
    return id;
}, "getAnchorId");
var adjustClustersAndEdges = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((graph, depth)=>{
    if (!graph || depth > 10) {
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Opting out, no graph ");
        return;
    } else {
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Opting in, graph ");
    }
    graph.nodes().forEach(function(id) {
        const children = graph.children(id);
        if (children.length > 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Cluster identified", id, " Replacement id in edges: ", findNonClusterChild(id, graph, id));
            descendants.set(id, extractDescendants(id, graph));
            clusterDb.set(id, {
                id: findNonClusterChild(id, graph, id),
                clusterData: graph.node(id)
            });
        }
    });
    graph.nodes().forEach(function(id) {
        const children = graph.children(id);
        const edges = graph.edges();
        if (children.length > 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Cluster identified", id, descendants);
            edges.forEach((edge)=>{
                const d1 = isDescendant(edge.v, id);
                const d2 = isDescendant(edge.w, id);
                if (d1 ^ d2) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Edge: ", edge, " leaves cluster ", id);
                    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Descendants of XXX ", id, ": ", descendants.get(id));
                    clusterDb.get(id).externalConnections = true;
                }
            });
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Not a cluster ", id, descendants);
        }
    });
    for (let id of clusterDb.keys()){
        const nonClusterChild = clusterDb.get(id).id;
        const parent = graph.parent(nonClusterChild);
        if (parent !== id && clusterDb.has(parent) && !clusterDb.get(parent).externalConnections) {
            clusterDb.get(id).id = parent;
        }
        const hasDirectOutgoingEdge = graph.edges().some((edge)=>edge.v === id);
        if (nonClusterChild && clusterDb.get(id)?.externalConnections && hasDirectOutgoingEdge && isNodeInExtractableCluster(graph, nonClusterChild, id)) {
            const safeAnchor = findSafeAnchorNode(graph, id, graph.parent(nonClusterChild));
            if (safeAnchor) {
                clusterDb.get(id).id = safeAnchor;
            }
        }
    }
    graph.edges().forEach(function(e) {
        const edge = graph.edge(e);
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(e));
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(graph.edge(e)));
        let v = e.v;
        let w = e.w;
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Fix XXX", clusterDb, "ids:", e.v, e.w, "Translating: ", clusterDb.get(e.v), " --- ", clusterDb.get(e.w));
        if (clusterDb.get(e.v) || clusterDb.get(e.w)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Fixing and trying - removing XXX", e.v, e.w, e.name);
            v = getAnchorId(e.v);
            w = getAnchorId(e.w);
            graph.removeEdge(e.v, e.w, e.name);
            if (v !== e.v) {
                const parent = graph.parent(v);
                clusterDb.get(parent).externalConnections = true;
                edge.fromCluster = e.v;
            }
            if (w !== e.w) {
                const parent = graph.parent(w);
                clusterDb.get(parent).externalConnections = true;
                edge.toCluster = e.w;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Fix Replacing with XXX", v, w, e.name);
            graph.setEdge(v, w, edge, e.name);
        }
    });
    extractor(graph, 0);
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].trace(clusterDb);
}, "adjustClustersAndEdges");
var extractor = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((graph, depth)=>{
    if (depth > 10) {
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].error("Bailing out");
        return;
    }
    let nodes = graph.nodes();
    let hasChildren = false;
    for (const node of nodes){
        const children = graph.children(node);
        hasChildren = hasChildren || children.length > 0;
    }
    if (!hasChildren) {
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Done, no node has children", graph.nodes());
        return;
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Nodes = ", nodes, depth);
    for (const node of nodes){
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Extracting node", node, clusterDb, clusterDb.has(node) && !clusterDb.get(node).externalConnections, !graph.parent(node), graph.node(node), graph.children("D"), " Depth ", depth);
        if (!clusterDb.has(node)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Not a cluster", node, depth);
        } else if (!clusterDb.get(node).externalConnections && graph.children(node) && graph.children(node).length > 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Cluster without external connections, without a parent and with children", node, depth);
            const graphSettings = graph.graph();
            let dir = graphSettings.rankdir === "TB" ? "LR" : "TB";
            if (clusterDb.get(node)?.clusterData?.dir) {
                dir = clusterDb.get(node).clusterData.dir;
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Fixing dir", clusterDb.get(node).clusterData.dir, dir);
            }
            const clusterGraph = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dagre$2d$d3$2d$es$2f$src$2f$graphlib$2f$graph$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Graph"]({
                multigraph: true,
                compound: true
            }).setGraph({
                rankdir: dir,
                nodesep: 50,
                ranksep: 50,
                marginx: 8,
                marginy: 8
            }).setDefaultEdgeLabel(function() {
                return {};
            });
            copy(node, graph, clusterGraph, node);
            graph.setNode(node, {
                clusterNode: true,
                id: node,
                clusterData: clusterDb.get(node).clusterData,
                label: clusterDb.get(node).label,
                graph: clusterGraph
            });
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Cluster ** ", node, " **not meeting the criteria !externalConnections:", !clusterDb.get(node).externalConnections, " no parent: ", !graph.parent(node), " children ", graph.children(node) && graph.children(node).length > 0, graph.children("D"), depth);
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug(clusterDb);
        }
    }
    nodes = graph.nodes();
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("New list of nodes", nodes);
    for (const node of nodes){
        const data = graph.node(node);
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug(" Now next level", node, data);
        if (data?.clusterNode) {
            extractor(data.graph, depth + 1);
        }
    }
}, "extractor");
var sorter = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((graph, nodes)=>{
    if (nodes.length === 0) {
        return [];
    }
    let result = Object.assign([], nodes);
    nodes.forEach((node)=>{
        const children = graph.children(node);
        const sorted = sorter(graph, children);
        result = [
            ...result,
            ...sorted
        ];
    });
    return result;
}, "sorter");
var sortNodesByHierarchy = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((graph)=>sorter(graph, graph.children()), "sortNodesByHierarchy");
var isNodeInExtractableCluster = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((graph, node, rootId)=>{
    let parent = graph.parent(node);
    while(parent && parent !== rootId){
        const cluster = clusterDb.get(parent);
        if (cluster && !cluster.externalConnections) {
            return true;
        }
        parent = graph.parent(parent);
    }
    return false;
}, "isNodeInExtractableCluster");
var findSafeAnchorNode = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((graph, clusterId, excludedCluster)=>{
    const children = graph.children(clusterId) ?? [];
    for (const child of children){
        if (child === excludedCluster || isDescendant(child, excludedCluster)) {
            continue;
        }
        const candidate = findNonClusterChild(child, graph, clusterId);
        if (!candidate) {
            continue;
        }
        if (!isNodeInExtractableCluster(graph, candidate, clusterId)) {
            return candidate;
        }
    }
    return null;
}, "findSafeAnchorNode");
// src/rendering-util/layout-algorithms/common/index.ts
function createCommonLayoutRenderer({ prepareLayout, measureLayout, runLayoutCore, paintLayout, afterPaint, paintOptions }) {
    const measureLayoutFn = measureLayout ?? defaultMeasureLayout;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(async function render(data4Layout, svg, helpers, options) {
        const element = svg.select("g");
        (helpers?.insertMarkers ?? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$OSK3NFVY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["markers_default"])(element, data4Layout.markers, data4Layout.type, data4Layout.diagramId);
        clearLayoutRenderState();
        const renderContext = {
            element,
            // root SVG <g>
            helpers,
            // Mermaid helper functions
            options
        };
        renderContext.preparedLayout = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : await prepareLayout?.(data4Layout, renderContext);
        const measure = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : await measureLayoutFn(data4Layout, renderContext);
        const coreResult = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : await runLayoutCore(data4Layout, renderContext);
        const paintContext = {
            ...renderContext,
            measure
        };
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        if (paintLayout) {
            await paintLayout(data4Layout, paintContext, coreResult);
        } else {
            await paintLayoutData(data4Layout, paintContext, paintOptions);
        }
        await afterPaint?.(data4Layout, paintContext, coreResult);
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, "render");
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(createCommonLayoutRenderer, "createCommonLayoutRenderer");
function clearLayoutRenderState() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$GVQU2GXP$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clear"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$OSK3NFVY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clear"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$L3NEJ4N5$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clear"])();
    clear4();
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(clearLayoutRenderState, "clearLayoutRenderState");
async function defaultMeasureLayout(data4Layout, { element }) {
    return await createGraphWithElements(element, data4Layout);
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(defaultMeasureLayout, "defaultMeasureLayout");
async function paintLayoutData(data4Layout, context, options = {}) {
    const { measure } = context;
    const { groups } = measure;
    for (const node of options.getNodes?.(data4Layout, context) ?? data4Layout.nodes){
        if (options.skipNode?.(node, context)) {
            continue;
        }
        await paintLayoutNode(groups, node, context, options);
    }
    const nodeById = buildNodeLookup(data4Layout.nodes);
    for (const edge of data4Layout.edges){
        if (shouldSkipPaintEdge(edge, options)) {
            continue;
        }
        await paintLayoutEdge(groups, edge, nodeById, data4Layout, options, context);
    }
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(paintLayoutData, "paintLayoutData");
async function paintLayoutNode(groups, node, context, options) {
    if (node.clusterNode) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$GVQU2GXP$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["positionNode"])(node);
    } else if (shouldPaintAsCluster(node, context, options)) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$L3NEJ4N5$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["insertCluster"])(groups.clusters, node);
    } else {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$GVQU2GXP$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["positionNode"])(node);
    }
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(paintLayoutNode, "paintLayoutNode");
function shouldPaintAsCluster(node, context, options) {
    return node.isGroup === true && (options.isCluster?.(node, context) ?? true);
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(shouldPaintAsCluster, "shouldPaintAsCluster");
function buildNodeLookup(nodes) {
    const nodeById = /* @__PURE__ */ new Map();
    for (const node of nodes){
        if (node?.id) {
            nodeById.set(node.id, node);
        }
    }
    return nodeById;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(buildNodeLookup, "buildNodeLookup");
function shouldSkipPaintEdge(edge, options) {
    return edge.isLayoutOnly || Boolean(options.skipEdge?.(edge));
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(shouldSkipPaintEdge, "shouldSkipPaintEdge");
async function paintLayoutEdge(groups, edge, nodeById, data4Layout, options, context) {
    const paths = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$OSK3NFVY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["insertEdge"])(groups.edgePaths, {
        ...edge
    }, options.clusterDb ?? /* @__PURE__ */ new Map(), data4Layout.type, getRenderedNode(edge.start, edge, nodeById, context, options), getRenderedNode(edge.end, edge, nodeById, context, options), data4Layout.diagramId, shouldSkipIntersect(edge, options));
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$OSK3NFVY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasEdgeLabel"])(edge)) {
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$OSK3NFVY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["edgeLabels"].has(edge.id)) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$OSK3NFVY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["insertEdgeLabel"])(groups.edgeLabels, edge);
        }
        positionRenderedEdgeLabel(edge, paths);
    }
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(paintLayoutEdge, "paintLayoutEdge");
function getRenderedNode(id, edge, nodeById, context, options) {
    return options.getEdgeNode?.(id, edge, context) ?? (id ? nodeById.get(id) ?? {} : {});
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(getRenderedNode, "getRenderedNode");
function shouldSkipIntersect(edge, options) {
    return typeof options.skipIntersect === "function" ? options.skipIntersect(edge) : options.skipIntersect ?? false;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(shouldSkipIntersect, "shouldSkipIntersect");
function positionRenderedEdgeLabel(edge, paths) {
    const path = paths?.updatedPath ?? paths?.originalPath;
    const siteConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig"])();
    const { subGraphTitleTotalMargin } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$GVQU2GXP$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSubGraphTitleMargins"])({
        flowchart: siteConfig.flowchart ?? {}
    });
    if (edge.label) {
        const el = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$OSK3NFVY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["edgeLabels"].get(edge.id);
        let x = edge.x;
        let y = edge.y;
        if (path) {
            const pos = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$75Z2AOVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils_default"].calcLabelPosition(path);
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Moving label " + edge.label + " from (", x, ",", y, ") to (", pos.x, ",", pos.y, ") abc88");
            if (paths?.updatedPath) {
                x = pos.x;
                y = pos.y;
            }
        }
        el.attr("transform", `translate(${x}, ${y + subGraphTitleTotalMargin / 2})`);
    }
    if (edge?.startLabelLeft) {
        const el = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$OSK3NFVY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["terminalLabels"].get(edge.id).startLeft;
        let x = edge?.x;
        let y = edge?.y;
        if (path) {
            const pos = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$75Z2AOVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils_default"].calcTerminalLabelPosition(edge.arrowTypeStart ? 10 : 0, "start_left", path);
            x = pos.x;
            y = pos.y;
        }
        el.attr("transform", `translate(${x}, ${y})`);
    }
    if (edge.startLabelRight) {
        const el = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$OSK3NFVY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["terminalLabels"].get(edge.id).startRight;
        let x = edge.x;
        let y = edge.y;
        if (path) {
            const pos = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$75Z2AOVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils_default"].calcTerminalLabelPosition(edge.arrowTypeStart ? 10 : 0, "start_right", path);
            x = pos.x;
            y = pos.y;
        }
        el.attr("transform", `translate(${x}, ${y})`);
    }
    if (edge.endLabelLeft) {
        const el = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$OSK3NFVY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["terminalLabels"].get(edge.id).endLeft;
        let x = edge.x;
        let y = edge.y;
        if (path) {
            const pos = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$75Z2AOVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils_default"].calcTerminalLabelPosition(edge.arrowTypeEnd ? 10 : 0, "end_left", path);
            x = pos.x;
            y = pos.y;
        }
        el.attr("transform", `translate(${x}, ${y})`);
    }
    if (edge.endLabelRight) {
        const el = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$OSK3NFVY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["terminalLabels"].get(edge.id).endRight;
        let x = edge.x;
        let y = edge.y;
        if (path) {
            const pos = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$75Z2AOVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils_default"].calcTerminalLabelPosition(edge.arrowTypeEnd ? 10 : 0, "end_right", path);
            x = pos.x;
            y = pos.y;
        }
        el.attr("transform", `translate(${x}, ${y})`);
    }
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(positionRenderedEdgeLabel, "positionRenderedEdgeLabel");
;
}),
"[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-75Z2AOVW.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ZERO_WIDTH_SPACE",
    ()=>ZERO_WIDTH_SPACE,
    "calculateTextDimensions",
    ()=>calculateTextDimensions,
    "calculateTextHeight",
    ()=>calculateTextHeight,
    "calculateTextWidth",
    ()=>calculateTextWidth,
    "cleanAndMerge",
    ()=>cleanAndMerge,
    "decodeEntities",
    ()=>decodeEntities,
    "encodeEntities",
    ()=>encodeEntities,
    "generateId",
    ()=>generateId,
    "getEdgeId",
    ()=>getEdgeId,
    "getStylesFromArray",
    ()=>getStylesFromArray,
    "handleUndefinedAttr",
    ()=>handleUndefinedAttr,
    "interpolateToCurve",
    ()=>interpolateToCurve,
    "isDetailedError",
    ()=>isDetailedError,
    "parseFontSize",
    ()=>parseFontSize,
    "random",
    ()=>random,
    "removeDirectives",
    ()=>removeDirectives,
    "utils_default",
    ()=>utils_default,
    "wrapLabel",
    ()=>wrapLabel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-DU6HZSFF.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-X3CZISLH.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-Y2CYZVJY.mjs [app-client] (ecmascript)");
// src/utils.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$braintree$2f$sanitize$2d$url$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@braintree/sanitize-url/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3/src/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveBasis$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/basis.js [app-client] (ecmascript) <export default as curveBasis>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basisClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveBasisClosed$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/basisClosed.js [app-client] (ecmascript) <export default as curveBasisClosed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basisOpen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveBasisOpen$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/basisOpen.js [app-client] (ecmascript) <export default as curveBasisOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$bump$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__bumpX__as__curveBumpX$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/bump.js [app-client] (ecmascript) <export bumpX as curveBumpX>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$bump$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__bumpY__as__curveBumpY$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/bump.js [app-client] (ecmascript) <export bumpY as curveBumpY>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$bundle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveBundle$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/bundle.js [app-client] (ecmascript) <export default as curveBundle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinalClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCardinalClosed$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/cardinalClosed.js [app-client] (ecmascript) <export default as curveCardinalClosed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinalOpen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCardinalOpen$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/cardinalOpen.js [app-client] (ecmascript) <export default as curveCardinalOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCardinal$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/cardinal.js [app-client] (ecmascript) <export default as curveCardinal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$catmullRomClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCatmullRomClosed$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/catmullRomClosed.js [app-client] (ecmascript) <export default as curveCatmullRomClosed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$catmullRomOpen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCatmullRomOpen$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/catmullRomOpen.js [app-client] (ecmascript) <export default as curveCatmullRomOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$catmullRom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCatmullRom$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/catmullRom.js [app-client] (ecmascript) <export default as curveCatmullRom>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$linear$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveLinear$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/linear.js [app-client] (ecmascript) <export default as curveLinear>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$linearClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveLinearClosed$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/linearClosed.js [app-client] (ecmascript) <export default as curveLinearClosed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$monotone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__monotoneX__as__curveMonotoneX$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/monotone.js [app-client] (ecmascript) <export monotoneX as curveMonotoneX>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$monotone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__monotoneY__as__curveMonotoneY$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/monotone.js [app-client] (ecmascript) <export monotoneY as curveMonotoneY>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$natural$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveNatural$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/natural.js [app-client] (ecmascript) <export default as curveNatural>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$step$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveStep$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/step.js [app-client] (ecmascript) <export default as curveStep>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$step$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__stepAfter__as__curveStepAfter$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/step.js [app-client] (ecmascript) <export stepAfter as curveStepAfter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$step$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__stepBefore__as__curveStepBefore$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/step.js [app-client] (ecmascript) <export stepBefore as curveStepBefore>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/select.js [app-client] (ecmascript) <export default as select>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$function$2f$memoize$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/compat/function/memoize.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$object$2f$merge$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/es-toolkit/dist/compat/object/merge.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
var ZERO_WIDTH_SPACE = "\u200B";
var d3CurveTypes = {
    curveBasis: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveBasis$3e$__["curveBasis"],
    curveBasisClosed: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basisClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveBasisClosed$3e$__["curveBasisClosed"],
    curveBasisOpen: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basisOpen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveBasisOpen$3e$__["curveBasisOpen"],
    curveBumpX: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$bump$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__bumpX__as__curveBumpX$3e$__["curveBumpX"],
    curveBumpY: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$bump$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__bumpY__as__curveBumpY$3e$__["curveBumpY"],
    curveBundle: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$bundle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveBundle$3e$__["curveBundle"],
    curveCardinalClosed: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinalClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCardinalClosed$3e$__["curveCardinalClosed"],
    curveCardinalOpen: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinalOpen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCardinalOpen$3e$__["curveCardinalOpen"],
    curveCardinal: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCardinal$3e$__["curveCardinal"],
    curveCatmullRomClosed: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$catmullRomClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCatmullRomClosed$3e$__["curveCatmullRomClosed"],
    curveCatmullRomOpen: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$catmullRomOpen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCatmullRomOpen$3e$__["curveCatmullRomOpen"],
    curveCatmullRom: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$catmullRom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCatmullRom$3e$__["curveCatmullRom"],
    curveLinear: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$linear$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveLinear$3e$__["curveLinear"],
    curveLinearClosed: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$linearClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveLinearClosed$3e$__["curveLinearClosed"],
    curveMonotoneX: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$monotone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__monotoneX__as__curveMonotoneX$3e$__["curveMonotoneX"],
    curveMonotoneY: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$monotone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__monotoneY__as__curveMonotoneY$3e$__["curveMonotoneY"],
    curveNatural: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$natural$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveNatural$3e$__["curveNatural"],
    curveStep: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$step$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveStep$3e$__["curveStep"],
    curveStepAfter: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$step$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__stepAfter__as__curveStepAfter$3e$__["curveStepAfter"],
    curveStepBefore: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$step$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__stepBefore__as__curveStepBefore$3e$__["curveStepBefore"]
};
var directiveWithoutOpen = /\s*(?:(\w+)(?=:):|(\w+))\s*(?:(\w+)|((?:(?!}%{2}).|\r?\n)*))?\s*(?:}%{2})?/gi;
var detectInit = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(text, config) {
    const inits = detectDirective(text, /(?:init\b)|(?:initialize\b)/);
    let results = {};
    if (Array.isArray(inits)) {
        const args = inits.map((init)=>init.args);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeDirective"])(args);
        results = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assignWithDepth_default"])(results, [
            ...args
        ]);
    } else {
        results = inits.args;
    }
    if (!results) {
        return;
    }
    let type = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["detectType"])(text, config);
    const prop = "config";
    if (results[prop] !== void 0) {
        if (type === "flowchart-v2") {
            type = "flowchart";
        }
        results[type] = results[prop];
        delete results[prop];
    }
    return results;
}, "detectInit");
var detectDirective = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(text, type = null) {
    try {
        const commentWithoutDirectives = new RegExp(`[%]{2}(?![{]${directiveWithoutOpen.source})(?=[}][%]{2}).*
`, "ig");
        text = text.trim().replace(commentWithoutDirectives, "").replace(/'/gm, '"');
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug(`Detecting diagram directive${type !== null ? " type:" + type : ""} based on the text:${text}`);
        let match;
        const result = [];
        while((match = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["directiveRegex"].exec(text)) !== null){
            if (match.index === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["directiveRegex"].lastIndex) {
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["directiveRegex"].lastIndex++;
            }
            if (match && !type || type && match[1]?.match(type) || type && match[2]?.match(type)) {
                const type2 = match[1] ? match[1] : match[2];
                const args = match[3] ? match[3].trim() : match[4] ? JSON.parse(match[4].trim()) : null;
                result.push({
                    type: type2,
                    args
                });
            }
        }
        if (result.length === 0) {
            return {
                type: text,
                args: null
            };
        }
        return result.length === 1 ? result[0] : result;
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].error(`ERROR: ${error.message} - Unable to parse directive type: '${type}' based on the text: '${text}'`);
        return {
            type: void 0,
            args: null
        };
    }
}, "detectDirective");
var removeDirectives = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(text) {
    return text.replace(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["directiveRegex"], "");
}, "removeDirectives");
var isSubstringInArray = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(str, arr) {
    for (const [i, element] of arr.entries()){
        if (element.match(str)) {
            return i;
        }
    }
    return -1;
}, "isSubstringInArray");
function interpolateToCurve(interpolate, defaultCurve) {
    if (!interpolate) {
        return defaultCurve;
    }
    const curveName = `curve${interpolate.charAt(0).toUpperCase() + interpolate.slice(1)}`;
    return d3CurveTypes[curveName] ?? defaultCurve;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(interpolateToCurve, "interpolateToCurve");
function formatUrl(linkStr, config) {
    const url = linkStr.trim();
    if (!url) {
        return void 0;
    }
    if (config.securityLevel !== "loose") {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$braintree$2f$sanitize$2d$url$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeUrl"])(url);
    }
    return url;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(formatUrl, "formatUrl");
var runFunc = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((functionName, ...params)=>{
    const arrPaths = functionName.split(".");
    const len = arrPaths.length - 1;
    const fnName = arrPaths[len];
    let obj = window;
    for(let i = 0; i < len; i++){
        obj = obj[arrPaths[i]];
        if (!obj) {
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].error(`Function name: ${functionName} not found in window`);
            return;
        }
    }
    obj[fnName](...params);
}, "runFunc");
function distance(p1, p2) {
    if (!p1 || !p2) {
        return 0;
    }
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(distance, "distance");
function traverseEdge(points) {
    let prevPoint;
    let totalDistance = 0;
    points.forEach((point)=>{
        totalDistance += distance(point, prevPoint);
        prevPoint = point;
    });
    const remainingDistance = totalDistance / 2;
    return calculatePoint(points, remainingDistance);
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(traverseEdge, "traverseEdge");
function calcLabelPosition(points) {
    if (points.length === 1) {
        return points[0];
    }
    return traverseEdge(points);
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(calcLabelPosition, "calcLabelPosition");
var roundNumber = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((num, precision = 2)=>{
    const factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
}, "roundNumber");
var calculatePoint = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((points, distanceToTraverse)=>{
    let prevPoint = void 0;
    let remainingDistance = distanceToTraverse;
    for (const point of points){
        if (prevPoint) {
            const vectorDistance = distance(point, prevPoint);
            if (vectorDistance === 0) {
                return prevPoint;
            }
            if (vectorDistance < remainingDistance) {
                remainingDistance -= vectorDistance;
            } else {
                const distanceRatio = remainingDistance / vectorDistance;
                if (distanceRatio <= 0) {
                    return prevPoint;
                }
                if (distanceRatio >= 1) {
                    return {
                        x: point.x,
                        y: point.y
                    };
                }
                if (distanceRatio > 0 && distanceRatio < 1) {
                    return {
                        x: roundNumber((1 - distanceRatio) * prevPoint.x + distanceRatio * point.x, 5),
                        y: roundNumber((1 - distanceRatio) * prevPoint.y + distanceRatio * point.y, 5)
                    };
                }
            }
        }
        prevPoint = point;
    }
    throw new Error("Could not find a suitable point for the given distance");
}, "calculatePoint");
var calcCardinalityPosition = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((isRelationTypePresent, points, initialPosition)=>{
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].info(`our points ${JSON.stringify(points)}`);
    if (points[0] !== initialPosition) {
        points = points.reverse();
    }
    const distanceToCardinalityPoint = 25;
    const center = calculatePoint(points, distanceToCardinalityPoint);
    const d = isRelationTypePresent ? 10 : 5;
    const angle = Math.atan2(points[0].y - center.y, points[0].x - center.x);
    const cardinalityPosition = {
        x: 0,
        y: 0
    };
    cardinalityPosition.x = Math.sin(angle) * d + (points[0].x + center.x) / 2;
    cardinalityPosition.y = -Math.cos(angle) * d + (points[0].y + center.y) / 2;
    return cardinalityPosition;
}, "calcCardinalityPosition");
function calcTerminalLabelPosition(terminalMarkerSize, position, _points) {
    const points = structuredClone(_points);
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].info("our points", points);
    if (position !== "start_left" && position !== "start_right") {
        points.reverse();
    }
    const distanceToCardinalityPoint = 25 + terminalMarkerSize;
    const center = calculatePoint(points, distanceToCardinalityPoint);
    const d = 10 + terminalMarkerSize * 0.5;
    const angle = Math.atan2(points[0].y - center.y, points[0].x - center.x);
    const cardinalityPosition = {
        x: 0,
        y: 0
    };
    if (position === "start_left") {
        cardinalityPosition.x = Math.sin(angle + Math.PI) * d + (points[0].x + center.x) / 2;
        cardinalityPosition.y = -Math.cos(angle + Math.PI) * d + (points[0].y + center.y) / 2;
    } else if (position === "end_right") {
        cardinalityPosition.x = Math.sin(angle - Math.PI) * d + (points[0].x + center.x) / 2 - 5;
        cardinalityPosition.y = -Math.cos(angle - Math.PI) * d + (points[0].y + center.y) / 2 - 5;
    } else if (position === "end_left") {
        cardinalityPosition.x = Math.sin(angle) * d + (points[0].x + center.x) / 2 - 5;
        cardinalityPosition.y = -Math.cos(angle) * d + (points[0].y + center.y) / 2 - 5;
    } else {
        cardinalityPosition.x = Math.sin(angle) * d + (points[0].x + center.x) / 2;
        cardinalityPosition.y = -Math.cos(angle) * d + (points[0].y + center.y) / 2;
    }
    return cardinalityPosition;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(calcTerminalLabelPosition, "calcTerminalLabelPosition");
function getStylesFromArray(arr) {
    let style = "";
    let labelStyle = "";
    for (const element of arr){
        if (element !== void 0) {
            if (element.startsWith("color:") || element.startsWith("text-align:")) {
                labelStyle = labelStyle + element + ";";
            } else {
                style = style + element + ";";
            }
        }
    }
    return {
        style,
        labelStyle
    };
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(getStylesFromArray, "getStylesFromArray");
var cnt = 0;
var generateId = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>{
    cnt++;
    return "id-" + Math.random().toString(36).substr(2, 12) + "-" + cnt;
}, "generateId");
function makeRandomHex(length) {
    let result = "";
    const characters = "0123456789abcdef";
    const charactersLength = characters.length;
    for(let i = 0; i < length; i++){
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(makeRandomHex, "makeRandomHex");
var random = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((options)=>{
    return makeRandomHex(options.length);
}, "random");
var getTextObj = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function() {
    return {
        x: 0,
        y: 0,
        fill: void 0,
        anchor: "start",
        style: "#666",
        width: 100,
        height: 100,
        textMargin: 0,
        rx: 0,
        ry: 0,
        valign: void 0,
        text: ""
    };
}, "getTextObj");
var drawSimpleText = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(elem, textData) {
    const nText = textData.text.replace(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["common_default"].lineBreakRegex, " ");
    const [, _fontSizePx] = parseFontSize(textData.fontSize);
    const textElem = elem.append("text");
    textElem.attr("x", textData.x);
    textElem.attr("y", textData.y);
    textElem.style("text-anchor", textData.anchor);
    textElem.style("font-family", textData.fontFamily);
    textElem.style("font-size", _fontSizePx);
    textElem.style("font-weight", textData.fontWeight);
    textElem.attr("fill", textData.fill);
    if (textData.class !== void 0) {
        textElem.attr("class", textData.class);
    }
    const span = textElem.append("tspan");
    span.attr("x", textData.x + textData.textMargin * 2);
    span.attr("fill", textData.fill);
    span.text(nText);
    return textElem;
}, "drawSimpleText");
var wrapLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$function$2f$memoize$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memoize"])((label, maxWidth, config)=>{
    if (!label) {
        return label;
    }
    config = Object.assign({
        fontSize: 12,
        fontWeight: 400,
        fontFamily: "Arial",
        joinWith: "<br/>"
    }, config);
    if (__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["common_default"].lineBreakRegex.test(label)) {
        return label;
    }
    const words = label.split(" ").filter(Boolean);
    const completedLines = [];
    let nextLine = "";
    words.forEach((word, index)=>{
        const wordLength = calculateTextWidth(`${word} `, config);
        const nextLineLength = calculateTextWidth(nextLine, config);
        if (wordLength > maxWidth) {
            const { hyphenatedStrings, remainingWord } = breakString(word, maxWidth, "-", config);
            completedLines.push(nextLine, ...hyphenatedStrings);
            nextLine = remainingWord;
        } else if (nextLineLength + wordLength >= maxWidth) {
            completedLines.push(nextLine);
            nextLine = word;
        } else {
            nextLine = [
                nextLine,
                word
            ].filter(Boolean).join(" ");
        }
        const currentWord = index + 1;
        const isLastWord = currentWord === words.length;
        if (isLastWord) {
            completedLines.push(nextLine);
        }
    });
    return completedLines.filter((line)=>line !== "").join(config.joinWith);
}, (label, maxWidth, config)=>`${label}${maxWidth}${config.fontSize}${config.fontWeight}${config.fontFamily}${config.joinWith}`);
var breakString = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$function$2f$memoize$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memoize"])((word, maxWidth, hyphenCharacter = "-", config)=>{
    config = Object.assign({
        fontSize: 12,
        fontWeight: 400,
        fontFamily: "Arial",
        margin: 0
    }, config);
    const characters = [
        ...word
    ];
    const lines = [];
    let currentLine = "";
    characters.forEach((character, index)=>{
        const nextLine = `${currentLine}${character}`;
        const lineWidth = calculateTextWidth(nextLine, config);
        if (lineWidth >= maxWidth) {
            const currentCharacter = index + 1;
            const isLastLine = characters.length === currentCharacter;
            const hyphenatedNextLine = `${nextLine}${hyphenCharacter}`;
            lines.push(isLastLine ? nextLine : hyphenatedNextLine);
            currentLine = "";
        } else {
            currentLine = nextLine;
        }
    });
    return {
        hyphenatedStrings: lines,
        remainingWord: currentLine
    };
}, (word, maxWidth, hyphenCharacter = "-", config)=>`${word}${maxWidth}${hyphenCharacter}${config.fontSize}${config.fontWeight}${config.fontFamily}`);
function calculateTextHeight(text, config) {
    return calculateTextDimensions(text, config).height;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(calculateTextHeight, "calculateTextHeight");
function calculateTextWidth(text, config) {
    return calculateTextDimensions(text, config).width;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(calculateTextWidth, "calculateTextWidth");
var calculateTextDimensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$function$2f$memoize$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memoize"])((text, config)=>{
    const { fontSize = 12, fontFamily = "Arial", fontWeight = 400 } = config;
    if (!text) {
        return {
            width: 0,
            height: 0
        };
    }
    const [, _fontSizePx] = parseFontSize(fontSize);
    const fontFamilies = [
        "sans-serif",
        fontFamily
    ];
    const lines = text.split(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["common_default"].lineBreakRegex);
    const dims = [];
    const body = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])("body");
    if (!body.remove) {
        return {
            width: 0,
            height: 0,
            lineHeight: 0
        };
    }
    const g = body.append("svg");
    for (const fontFamily2 of fontFamilies){
        let cHeight = 0;
        const dim = {
            width: 0,
            height: 0,
            lineHeight: 0
        };
        for (const line of lines){
            const textObj = getTextObj();
            textObj.text = line || ZERO_WIDTH_SPACE;
            const textElem = drawSimpleText(g, textObj).style("font-size", _fontSizePx).style("font-weight", fontWeight).style("font-family", fontFamily2);
            const bBox = (textElem._groups || textElem)[0][0].getBBox();
            if (bBox.width === 0 && bBox.height === 0) {
                throw new Error("svg element not in render tree");
            }
            dim.width = Math.round(Math.max(dim.width, bBox.width));
            cHeight = Math.round(bBox.height);
            dim.height += cHeight;
            dim.lineHeight = Math.round(Math.max(dim.lineHeight, cHeight));
        }
        dims.push(dim);
    }
    g.remove();
    const index = isNaN(dims[1].height) || isNaN(dims[1].width) || isNaN(dims[1].lineHeight) || dims[0].height > dims[1].height && dims[0].width > dims[1].width && dims[0].lineHeight > dims[1].lineHeight ? 0 : 1;
    return dims[index];
}, (text, config)=>`${text}${config.fontSize}${config.fontWeight}${config.fontFamily}`);
var InitIDGenerator = class {
    constructor(deterministic = false, seed){
        this.count = 0;
        this.count = seed ? seed.length : 0;
        this.next = deterministic ? ()=>this.count++ : ()=>Date.now();
    }
    static{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(this, "InitIDGenerator");
    }
};
var decoder;
var entityDecode = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(html) {
    decoder = decoder || document.createElement("div");
    html = escape(html).replace(/%26/g, "&").replace(/%23/g, "#").replace(/%3B/g, ";");
    decoder.innerHTML = html;
    return unescape(decoder.textContent);
}, "entityDecode");
function isDetailedError(error) {
    return "str" in error;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(isDetailedError, "isDetailedError");
var insertTitle = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((parent, cssClass, titleTopMargin, title)=>{
    if (!title) {
        return;
    }
    const bounds = parent.node()?.getBBox();
    if (!bounds) {
        return;
    }
    parent.append("text").text(title).attr("text-anchor", "middle").attr("x", bounds.x + bounds.width / 2).attr("y", -titleTopMargin).attr("class", cssClass);
}, "insertTitle");
var parseFontSize = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((fontSize)=>{
    if (typeof fontSize === "number") {
        return [
            fontSize,
            fontSize + "px"
        ];
    }
    const fontSizeNumber = parseInt(fontSize ?? "", 10);
    if (Number.isNaN(fontSizeNumber)) {
        return [
            void 0,
            void 0
        ];
    } else if (fontSize === String(fontSizeNumber)) {
        return [
            fontSizeNumber,
            fontSize + "px"
        ];
    } else {
        return [
            fontSizeNumber,
            fontSize
        ];
    }
}, "parseFontSize");
function cleanAndMerge(defaultData, data) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$object$2f$merge$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"])({}, defaultData, data);
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(cleanAndMerge, "cleanAndMerge");
var utils_default = {
    assignWithDepth: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assignWithDepth_default"],
    wrapLabel,
    calculateTextHeight,
    calculateTextWidth,
    calculateTextDimensions,
    cleanAndMerge,
    detectInit,
    detectDirective,
    isSubstringInArray,
    interpolateToCurve,
    calcLabelPosition,
    calcCardinalityPosition,
    calcTerminalLabelPosition,
    formatUrl,
    getStylesFromArray,
    generateId,
    random,
    runFunc,
    entityDecode,
    insertTitle,
    isLabelCoordinateInPath,
    parseFontSize,
    InitIDGenerator
};
var encodeEntities = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(text) {
    let txt = text;
    txt = txt.replace(/style.*:\S*#.*;/g, function(s) {
        return s.substring(0, s.length - 1);
    });
    txt = txt.replace(/classDef.*:\S*#.*;/g, function(s) {
        return s.substring(0, s.length - 1);
    });
    txt = txt.replace(/#\w+;/g, function(s) {
        const innerTxt = s.substring(1, s.length - 1);
        const isInt = /^\+?\d+$/.test(innerTxt);
        if (isInt) {
            return "\uFB02\xB0\xB0" + innerTxt + "\xB6\xDF";
        } else {
            return "\uFB02\xB0" + innerTxt + "\xB6\xDF";
        }
    });
    return txt;
}, "encodeEntities");
var decodeEntities = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(text) {
    return text.replace(/ﬂ°°/g, "&#").replace(/ﬂ°/g, "&").replace(/¶ß/g, ";");
}, "decodeEntities");
var getEdgeId = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((from, to, { counter = 0, prefix, suffix }, id)=>{
    if (id) {
        return id;
    }
    return `${prefix ? `${prefix}_` : ""}${from}_${to}_${counter}${suffix ? `_${suffix}` : ""}`;
}, "getEdgeId");
function handleUndefinedAttr(attrValue) {
    return attrValue ?? null;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(handleUndefinedAttr, "handleUndefinedAttr");
function isLabelCoordinateInPath(point, dAttr) {
    const roundedX = Math.round(point.x);
    const roundedY = Math.round(point.y);
    const sanitizedD = dAttr.replace(/(\d+\.\d+)/g, (match)=>Math.round(parseFloat(match)).toString());
    return sanitizedD.includes(roundedX.toString()) || sanitizedD.includes(roundedY.toString());
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(isLabelCoordinateInPath, "isLabelCoordinateInPath");
;
}),
"[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-CLGD4ZFX.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "selectSvgElement",
    ()=>selectSvgElement
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-DU6HZSFF.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-Y2CYZVJY.mjs [app-client] (ecmascript)");
// src/rendering-util/selectSvgElement.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3/src/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/select.js [app-client] (ecmascript) <export default as select>");
;
;
;
var selectSvgElement = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((id)=>{
    const { securityLevel } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig2"])();
    let root = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])("body");
    if (securityLevel === "sandbox") {
        const sandboxElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(`#i${id}`);
        const doc = sandboxElement.node()?.contentDocument ?? document;
        root = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(doc.body);
    }
    const svg = root.select(`#${id}`);
    return svg;
}, "selectSvgElement");
;
}),
"[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-GMAD6QVW.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computeDimensionOfText",
    ()=>computeDimensionOfText,
    "createText",
    ()=>createText,
    "fastdom_default",
    ()=>fastdom_default
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$PWAF6VOD$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-PWAF6VOD.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$75Z2AOVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-75Z2AOVW.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-DU6HZSFF.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-X3CZISLH.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-Y2CYZVJY.mjs [app-client] (ecmascript)");
// src/rendering-util/fastdom.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$fastdom$2f$fastdom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/fastdom/fastdom.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$fastdom$2f$extensions$2f$fastdom$2d$promised$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/fastdom/extensions/fastdom-promised.js [app-client] (ecmascript)");
// src/rendering-util/createText.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3/src/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/select.js [app-client] (ecmascript) <export default as select>");
// src/rendering-util/handle-markdown-text.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$node_modules$2f$marked$2f$lib$2f$marked$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/node_modules/marked/lib/marked.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$ts$2d$dedent$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/ts-dedent/esm/index.js [app-client] (ecmascript)");
;
;
;
;
;
// src/profiler.ts
var hasPerformance = typeof performance !== "undefined" && typeof performance.now === "function";
var now = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>hasPerformance ? performance.now() : 0, "now");
var MEASURE_PREFIX = "\u{1F9DC} ";
var DEVTOOLS_TRACK = "Mermaid render";
var DEVTOOLS_TRACK_GROUP = "Mermaid";
var PHASE_COLORS = {
    parse: "tertiary",
    prepare: "secondary",
    measure: "primary",
    layout: "primary-dark",
    layoutCore: "error",
    draw: "primary-light",
    paint: "secondary-dark",
    serialize: "tertiary-dark",
    render: "primary-light"
};
var Profiler = class {
    constructor(){
        /** Runtime toggle. Off by default even in profiling builds. */ this.enabled = false;
        /** Log a summary to the console automatically when each root span closes. */ this.autoPrint = true;
        /** Completed render trees, oldest first, capped at {@link maxRecords}. */ this.records = [];
        this.maxRecords = 200;
        this.roots = [];
        this.stack = [];
        this.buckets = {};
    }
    static{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(this, "Profiler");
    }
    enable() {
        this.enabled = true;
        return this;
    }
    disable() {
        this.enabled = false;
        return this;
    }
    /** Begin a new top-level measurement (one per diagram render). */ start(label) {
        if (!this.enabled) {
            return;
        }
        this.roots = [];
        this.stack = [];
        this.buckets = {};
        this.begin(label);
    }
    /**
   * Accumulate the wall-clock of a synchronous sub-operation into a named bucket,
   * summed over every call within the render — for hot operations that run too
   * often to be individual tree spans (e.g. per-node `getBBox`). Returns the
   * function's result. No-op (just calls `fn`) unless enabled.
   */ tickSync(name, fn) {
        if (!this.enabled) {
            return fn();
        }
        const t0 = now();
        try {
            return fn();
        } finally{
            this.buckets[name] = (this.buckets[name] ?? 0) + (now() - t0);
        }
    }
    /**
   * Async variant of {@link tickSync}. WARNING: only meaningful for operations
   * that run one-at-a-time. Do NOT use it for calls awaited concurrently (e.g.
   * `Promise.all(nodes.map(...))`) — their wall-clocks overlap and the summed
   * bucket balloons far past the real elapsed time. For concurrent CPU
   * attribution use a DevTools CPU profile instead.
   */ async tick(name, fn) {
        if (!this.enabled) {
            return fn();
        }
        const t0 = now();
        try {
            return await fn();
        } finally{
            this.buckets[name] = (this.buckets[name] ?? 0) + (now() - t0);
        }
    }
    /** End the current top-level measurement and optionally print a summary. */ stop() {
        if (!this.enabled) {
            return void 0;
        }
        while(this.stack.length > 0){
            this.end();
        }
        const root = this.roots.at(-1);
        const label = this.runLabel ?? root?.name;
        if (root) {
            this.records.push({
                label: label ?? root.name,
                tree: root,
                buckets: {
                    ...this.buckets
                }
            });
            if (this.records.length > this.maxRecords) {
                this.records.splice(0, this.records.length - this.maxRecords);
            }
            if (this.autoPrint) {
                this.printSummary(root, label);
            }
        }
        this.runLabel = void 0;
        return root;
    }
    /** Open a child span. Pair with {@link end}. No-op unless enabled. */ begin(name) {
        if (!this.enabled) {
            return;
        }
        const span = {
            name,
            start: now(),
            duration: -1,
            children: []
        };
        const parent = this.stack.at(-1);
        if (parent) {
            parent.children.push(span);
        } else {
            this.roots.push(span);
        }
        this.stack.push(span);
        if (hasPerformance && typeof performance.mark === "function") {
            try {
                performance.mark(`${MEASURE_PREFIX}${name} \u25B6`);
            } catch  {}
        }
    }
    /** Close the most recently opened span. No-op unless enabled. */ end() {
        if (!this.enabled) {
            return;
        }
        const span = this.stack.pop();
        if (!span) {
            return;
        }
        const end = now();
        span.duration = end - span.start;
        if (hasPerformance && typeof performance.measure === "function") {
            try {
                performance.measure(`${MEASURE_PREFIX}${span.name}`, {
                    start: span.start,
                    end,
                    detail: {
                        devtools: {
                            dataType: "track-entry",
                            track: DEVTOOLS_TRACK,
                            trackGroup: DEVTOOLS_TRACK_GROUP,
                            color: PHASE_COLORS[span.name] ?? "primary",
                            tooltipText: `${span.name} \u2014 ${span.duration.toFixed(1)} ms`
                        }
                    }
                });
            } catch  {}
        }
    }
    /**
   * Measure an async phase. Returns the wrapped function's result and rethrows
   * any error after closing the span, so instrumentation never swallows
   * failures or leaks an open span. No measurement overhead unless enabled.
   */ async span(name, fn) {
        if (!this.enabled) {
            return fn();
        }
        this.begin(name);
        try {
            return await fn();
        } finally{
            this.end();
        }
    }
    /** The most recent completed render tree, or `undefined`. */ report() {
        return this.records.at(-1)?.tree ?? this.roots.at(-1);
    }
    /** Drop all collected records and any in-progress spans. */ clear() {
        this.records.length = 0;
        this.roots = [];
        this.stack = [];
        this.runLabel = void 0;
    }
    reset() {
        this.roots = [];
        this.stack = [];
    }
    printSummary(root = this.report(), label) {
        if (!root) {
            return;
        }
        const total = root.duration;
        const heading = label && label !== root.name ? `${root.name} [${label}]` : root.name;
        const lines = [
            "ms        %    phase"
        ];
        const walk = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((span, depth)=>{
            const indent = "  ".repeat(depth);
            const ms = span.duration.toFixed(1).padStart(8);
            const pct = total > 0 ? `${(span.duration / total * 100).toFixed(0).padStart(3)}%` : "   -";
            lines.push(`${ms}  ${pct}  ${indent}${span.name}`);
            for (const child of span.children){
                walk(child, depth + 1);
            }
            if (span.children.length > 0) {
                const childTotal = span.children.reduce((sum, c)=>sum + c.duration, 0);
                const self = span.duration - childTotal;
                if (self > 0.5) {
                    const selfMs = self.toFixed(1).padStart(8);
                    lines.push(`${selfMs}       ${indent}  (self)`);
                }
            }
        }, "walk");
        walk(root, 0);
        const bucketNames = Object.keys(this.buckets);
        if (bucketNames.length > 0) {
            lines.push("\u2014\u2014 buckets (summed) \u2014\u2014");
            for (const name of bucketNames){
                lines.push(`${this.buckets[name].toFixed(1).padStart(8)}       ${name}`);
            }
        }
        console.log(`${MEASURE_PREFIX}mermaid render profile \xB7 ${heading}
${lines.join("\n")}`);
    }
};
globalThis.injected ??= {
    includeLargeFeatures: true,
    profiling: false,
    version: "0.0.0"
};
var profiler = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : /* @__PURE__ */ new Profiler();
;
;
var fastdom = // @ts-expect-error -- fastdom types aren't yet ESM-compatible, we need this hack
__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$fastdom$2f$fastdom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].extend({
    /**
     * `requestAnimationFrame` is too slow compared to `queueMicrotask`.
     */ raf (cb) {
        if (typeof queueMicrotask === "function") {
            queueMicrotask(cb);
        } else {
            setTimeout(cb, 0);
        }
    }
}).extend(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$fastdom$2f$extensions$2f$fastdom$2d$promised$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
var fastdom_default = fastdom;
;
;
;
function preprocessMarkdown(markdown, { markdownAutoWrap }) {
    const withoutBR = markdown.replace(/<br\/>/g, "\n");
    const withoutMultipleNewlines = withoutBR.replace(/\n{2,}/g, "\n");
    const withoutExtraSpaces = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$ts$2d$dedent$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dedent"])(withoutMultipleNewlines);
    if (markdownAutoWrap === false) {}
    return withoutExtraSpaces;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(preprocessMarkdown, "preprocessMarkdown");
function nonMarkdownToLines(nonMarkdownText) {
    return nonMarkdownText.split(/\\n|\n|<br\s*\/?>/gi).map((line)=>line.trim().match(/<[^>]+>|[^\s<>]+/g)?.map((word)=>({
                content: word,
                type: "normal"
            })) ?? []);
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(nonMarkdownToLines, "nonMarkdownToLines");
function markdownToLines(markdown, config = {}) {
    const preprocessedMarkdown = preprocessMarkdown(markdown, config);
    const nodes = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$node_modules$2f$marked$2f$lib$2f$marked$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["marked"].lexer(preprocessedMarkdown);
    const lines = [
        []
    ];
    let currentLine = 0;
    function processNode(node, parentType = "normal") {
        if (node.type === "text") {
            const textLines = node.text.split("\n");
            textLines.forEach((textLine, index)=>{
                if (index !== 0) {
                    currentLine++;
                    lines.push([]);
                }
                textLine.split(" ").forEach((word)=>{
                    word = word.replace(/&#39;/g, `'`);
                    if (word) {
                        lines[currentLine].push({
                            content: word,
                            type: parentType
                        });
                    }
                });
            });
        } else if (node.type === "strong" || node.type === "em") {
            node.tokens.forEach((contentNode)=>{
                processNode(contentNode, node.type);
            });
        } else if (node.type === "html") {
            lines[currentLine].push({
                content: node.text,
                type: "normal"
            });
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(processNode, "processNode");
    nodes.forEach((treeNode)=>{
        if (treeNode.type === "paragraph") {
            treeNode.tokens?.forEach((contentNode)=>{
                processNode(contentNode);
            });
        } else if (treeNode.type === "html") {
            lines[currentLine].push({
                content: treeNode.text,
                type: "normal"
            });
        } else {
            lines[currentLine].push({
                content: treeNode.raw,
                type: "normal"
            });
        }
    });
    return lines;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(markdownToLines, "markdownToLines");
function nonMarkdownToHTML(text) {
    if (!text) {
        return "";
    }
    return `<p>${/**
   * Replace new lines with <br /> tags.
   *
   * Unlike in markdown text, `\n` sequences are treated as line breaks here.
   */ text.replace(/\\n|\n/g, "<br />")}</p>`;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(nonMarkdownToHTML, "nonMarkdownToHTML");
function markdownToHTML(markdown, { markdownAutoWrap } = {}) {
    const nodes = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$node_modules$2f$marked$2f$lib$2f$marked$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["marked"].lexer(markdown);
    function output(node) {
        if (node.type === "text") {
            if (markdownAutoWrap === false) {
                return node.text.replace(/\n */g, "<br/>").replace(/ /g, "&nbsp;");
            }
            return node.text.replace(/\n */g, "<br/>");
        } else if (node.type === "strong") {
            return `<strong>${node.tokens?.map(output).join("")}</strong>`;
        } else if (node.type === "em") {
            return `<em>${node.tokens?.map(output).join("")}</em>`;
        } else if (node.type === "paragraph") {
            return `<p>${node.tokens?.map(output).join("")}</p>`;
        } else if (node.type === "space") {
            return "";
        } else if (node.type === "html") {
            return `${node.text}`;
        } else if (node.type === "escape") {
            return node.text;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].warn(`Unsupported markdown: ${node.type}`);
        return node.raw;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(output, "output");
    return nodes.map(output).join("");
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(markdownToHTML, "markdownToHTML");
// src/rendering-util/splitText.ts
function splitTextToChars(text) {
    if (Intl.Segmenter) {
        return [
            ...new Intl.Segmenter().segment(text)
        ].map((s)=>s.segment);
    }
    return [
        ...text
    ];
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(splitTextToChars, "splitTextToChars");
function splitWordToFitWidth(checkFit, word) {
    const characters = splitTextToChars(word.content);
    return splitWordToFitWidthRecursion(checkFit, [], characters, word.type);
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(splitWordToFitWidth, "splitWordToFitWidth");
function splitWordToFitWidthRecursion(checkFit, usedChars, remainingChars, type) {
    if (remainingChars.length === 0) {
        return [
            {
                content: usedChars.join(""),
                type
            },
            {
                content: "",
                type
            }
        ];
    }
    const [nextChar, ...rest] = remainingChars;
    const newWord = [
        ...usedChars,
        nextChar
    ];
    if (checkFit([
        {
            content: newWord.join(""),
            type
        }
    ])) {
        return splitWordToFitWidthRecursion(checkFit, newWord, rest, type);
    }
    if (usedChars.length === 0 && nextChar) {
        usedChars.push(nextChar);
        remainingChars.shift();
    }
    return [
        {
            content: usedChars.join(""),
            type
        },
        {
            content: remainingChars.join(""),
            type
        }
    ];
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(splitWordToFitWidthRecursion, "splitWordToFitWidthRecursion");
function splitLineToFitWidth(line, checkFit) {
    if (line.some(({ content })=>content.includes("\n"))) {
        throw new Error("splitLineToFitWidth does not support newlines in the line");
    }
    return splitLineToFitWidthRecursion(line, checkFit);
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(splitLineToFitWidth, "splitLineToFitWidth");
function splitLineToFitWidthRecursion(words, checkFit, lines = [], newLine = []) {
    if (words.length === 0) {
        if (newLine.length > 0) {
            lines.push(newLine);
        }
        return lines.length > 0 ? lines : [];
    }
    let joiner = "";
    if (words[0].content === " ") {
        joiner = " ";
        words.shift();
    }
    const nextWord = words.shift() ?? {
        content: " ",
        type: "normal"
    };
    const lineWithNextWord = [
        ...newLine
    ];
    if (joiner !== "") {
        lineWithNextWord.push({
            content: joiner,
            type: "normal"
        });
    }
    lineWithNextWord.push(nextWord);
    if (checkFit(lineWithNextWord)) {
        return splitLineToFitWidthRecursion(words, checkFit, lines, lineWithNextWord);
    }
    if (newLine.length > 0) {
        lines.push(newLine);
        words.unshift(nextWord);
    } else if (nextWord.content) {
        const [line, rest] = splitWordToFitWidth(checkFit, nextWord);
        lines.push([
            line
        ]);
        if (rest.content) {
            words.unshift(rest);
        }
    }
    return splitLineToFitWidthRecursion(words, checkFit, lines);
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(splitLineToFitWidthRecursion, "splitLineToFitWidthRecursion");
// src/rendering-util/createText.ts
function applyStyle(dom, styleFn) {
    if (styleFn) {
        dom.attr("style", styleFn);
    }
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(applyStyle, "applyStyle");
var maxSafeSizeForWidth = 16384;
async function addHtmlSpan(element, node, width, classes, addBackground = false, config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig"])()) {
    const fo = element.append("foreignObject");
    fo.attr("width", `${Math.min(10 * width, maxSafeSizeForWidth)}px`);
    fo.attr("height", `${Math.min(10 * width, maxSafeSizeForWidth)}px`);
    const div = fo.append("xhtml:div");
    const sanitizedLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasKatex"])(node.label) ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["renderKatexSanitized"])(node.label.replace(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["common_default"].lineBreakRegex, "\n"), config) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeText"])(node.label, config);
    const labelClass = node.isNode ? "nodeLabel" : "edgeLabel";
    const span = div.append("span");
    span.html(sanitizedLabel);
    applyStyle(span, node.labelStyle);
    span.attr("class", `${labelClass} ${classes}`);
    applyStyle(div, node.labelStyle);
    div.style("display", "table-cell");
    div.style("white-space", "nowrap");
    div.style("line-height", "1.5");
    if (width !== Number.POSITIVE_INFINITY) {
        div.style("max-width", width + "px");
        div.style("text-align", "center");
    }
    div.attr("xmlns", "http://www.w3.org/1999/xhtml");
    if (addBackground) {
        div.attr("class", "labelBkg");
    }
    const bbox = await fastdom_default.measure(()=>div.node().getBoundingClientRect());
    if (bbox.width === width) {
        div.style("display", "table");
        div.style("white-space", "break-spaces");
        div.style("width", width + "px");
    }
    return fo.node();
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(addHtmlSpan, "addHtmlSpan");
function createTspan(textElement, lineIndex, lineHeight, centerText = false) {
    const tspan = textElement.append("tspan").attr("class", "text-outer-tspan").attr("x", 0).attr("y", lineIndex * lineHeight - 0.1 + "em").attr("dy", lineHeight + "em");
    if (centerText) {
        tspan.attr("text-anchor", "middle");
    }
    return tspan;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(createTspan, "createTspan");
function computeWidthOfText(parentNode, lineHeight, line) {
    const testElement = parentNode.append("text");
    const testSpan = createTspan(testElement, 1, lineHeight);
    updateTextContentAndStyles(testSpan, line);
    const textLength = testSpan.node().getComputedTextLength();
    testElement.remove();
    return textLength;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(computeWidthOfText, "computeWidthOfText");
function computeDimensionOfText(parentNode, lineHeight, text) {
    const testElement = parentNode.append("text");
    const testSpan = createTspan(testElement, 1, lineHeight);
    updateTextContentAndStyles(testSpan, [
        {
            content: text,
            type: "normal"
        }
    ]);
    const textDimension = testSpan.node()?.getBoundingClientRect();
    if (textDimension) {
        testElement.remove();
    }
    return textDimension;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(computeDimensionOfText, "computeDimensionOfText");
function createFormattedText(width, g, structuredText, addBackground = false, centerText = false) {
    const lineHeight = 1.1;
    const labelGroup = g.append("g");
    const bkg = labelGroup.insert("rect").attr("class", "background").attr("style", "stroke: none");
    const textElement = labelGroup.append("text").attr("y", "-10.1");
    if (centerText) {
        textElement.attr("text-anchor", "middle");
    }
    let lineIndex = 0;
    for (const line of structuredText){
        const checkWidth = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((line2)=>computeWidthOfText(labelGroup, lineHeight, line2) <= width, "checkWidth");
        const linesUnderWidth = checkWidth(line) ? [
            line
        ] : splitLineToFitWidth(line, checkWidth);
        for (const preparedLine of linesUnderWidth){
            const tspan = createTspan(textElement, lineIndex, lineHeight, centerText);
            updateTextContentAndStyles(tspan, preparedLine);
            lineIndex++;
        }
    }
    if (addBackground) {
        const bbox = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : textElement.node().getBBox();
        const padding = 2;
        bkg.attr("x", bbox.x - padding).attr("y", bbox.y - padding).attr("width", bbox.width + 2 * padding).attr("height", bbox.height + 2 * padding);
        return labelGroup.node();
    } else {
        return textElement.node();
    }
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(createFormattedText, "createFormattedText");
function decodeHTMLEntities(text) {
    const regex = /&(amp|lt|gt);/g;
    return text.replace(regex, (match, entity)=>{
        switch(entity){
            case "amp":
                return "&";
            case "lt":
                return "<";
            case "gt":
                return ">";
            default:
                return match;
        }
    });
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(decodeHTMLEntities, "decodeHTMLEntities");
function updateTextContentAndStyles(tspan, wrappedLine) {
    tspan.text("");
    wrappedLine.forEach((word, index)=>{
        const innerTspan = tspan.append("tspan").attr("font-style", word.type === "em" ? "italic" : "normal").attr("class", "text-inner-tspan").attr("font-weight", word.type === "strong" ? "bold" : "normal");
        if (index === 0) {
            innerTspan.text(decodeHTMLEntities(word.content));
        } else {
            innerTspan.text(" " + decodeHTMLEntities(word.content));
        }
    });
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(updateTextContentAndStyles, "updateTextContentAndStyles");
async function replaceIconSubstring(text, config = {}) {
    const pendingReplacements = [];
    text.replace(/(fa[bklrs]?):fa-([\w-]+)/g, (fullMatch, prefix, iconName)=>{
        pendingReplacements.push((async ()=>{
            const registeredIconName = `${prefix}:${iconName}`;
            if (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$PWAF6VOD$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isIconAvailable"])(registeredIconName)) {
                return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$PWAF6VOD$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getIconSVG"])(registeredIconName, void 0, {
                    class: "label-icon"
                });
            } else {
                return `<i class='${(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeText"])(fullMatch, config).replace(":", " ")}'></i>`;
            }
        })());
        return fullMatch;
    });
    const replacements = await Promise.all(pendingReplacements);
    return text.replace(/(fa[bklrs]?):fa-([\w-]+)/g, ()=>replacements.shift() ?? "");
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(replaceIconSubstring, "replaceIconSubstring");
var createText = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(async (el, text = "", { style = "", isTitle = false, classes = "", useHtmlLabels = true, markdown = true, isNode = true, /**
   * The width to wrap the text within. Set to `Number.POSITIVE_INFINITY` for no wrapping.
   */ width = 200, addSvgBackground = false } = {}, config)=>{
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("XYZ createText", text, style, isTitle, classes, useHtmlLabels, isNode, "addSvgBackground: ", addSvgBackground);
    if (useHtmlLabels) {
        const htmlText = markdown ? markdownToHTML(text, config) : nonMarkdownToHTML(text);
        const decodedReplacedText = await replaceIconSubstring((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$75Z2AOVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decodeEntities"])(htmlText), config);
        const inputForKatex = text.replace(/\\\\/g, "\\");
        const node = {
            isNode,
            label: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasKatex"])(text) ? inputForKatex : decodedReplacedText,
            labelStyle: style.replace("fill:", "color:")
        };
        const vertexNode = await addHtmlSpan(el, node, width, classes, addSvgBackground, config);
        return vertexNode;
    } else {
        const sanitizeBR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$75Z2AOVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decodeEntities"])(text.replace(/<br\s*\/?>/g, "<br/>"));
        const structuredText = markdown ? markdownToLines(sanitizeBR.replace("<br>", "<br/>"), config) : nonMarkdownToLines(sanitizeBR);
        const svgLabel = createFormattedText(width, el, structuredText, text ? addSvgBackground : false, !isNode);
        if (isNode) {
            if (/stroke:/.exec(style)) {
                style = style.replace("stroke:", "lineColor:");
            }
            const nodeLabelTextStyle = style.replace(/stroke:[^;]+;?/g, "").replace(/stroke-width:[^;]+;?/g, "").replace(/fill:[^;]+;?/g, "").replace(/color:/g, "fill:");
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(svgLabel).attr("style", nodeLabelTextStyle);
        } else {
            const edgeLabelRectStyle = style.replace(/stroke:[^;]+;?/g, "").replace(/stroke-width:[^;]+;?/g, "").replace(/fill:[^;]+;?/g, "").replace(/background:/g, "fill:");
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(svgLabel).select("rect").attr("style", edgeLabelRectStyle.replace(/background:/g, "fill:"));
            const edgeLabelTextStyle = style.replace(/stroke:[^;]+;?/g, "").replace(/stroke-width:[^;]+;?/g, "").replace(/fill:[^;]+;?/g, "").replace(/color:/g, "fill:");
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(svgLabel).select("text").attr("style", edgeLabelTextStyle);
        }
        if (isTitle) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(svgLabel).selectAll("tspan.text-outer-tspan").classed("title-row", true);
        } else {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(svgLabel).selectAll("tspan.text-outer-tspan").classed("row", true);
        }
        return svgLabel;
    }
}, "createText");
;
}),
"[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-GVQU2GXP.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clear",
    ()=>clear,
    "getSubGraphTitleMargins",
    ()=>getSubGraphTitleMargins,
    "insertNode",
    ()=>insertNode,
    "positionNode",
    ()=>positionNode,
    "setNodeElem",
    ()=>setNodeElem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$4HAMMTFA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-4HAMMTFA.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$75Z2AOVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-75Z2AOVW.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-X3CZISLH.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-Y2CYZVJY.mjs [app-client] (ecmascript)");
;
;
;
;
// src/utils/subGraphTitleMargins.ts
var getSubGraphTitleMargins = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(({ flowchart })=>{
    const subGraphTitleTopMargin = flowchart?.subGraphTitleMargin?.top ?? 0;
    const subGraphTitleBottomMargin = flowchart?.subGraphTitleMargin?.bottom ?? 0;
    const subGraphTitleTotalMargin = subGraphTitleTopMargin + subGraphTitleBottomMargin;
    return {
        subGraphTitleTopMargin,
        subGraphTitleBottomMargin,
        subGraphTitleTotalMargin
    };
}, "getSubGraphTitleMargins");
// src/rendering-util/rendering-elements/nodes.ts
var nodeElems = /* @__PURE__ */ new Map();
async function insertNode(elem, node, renderOptions) {
    let newEl;
    let el;
    if (node.shape === "rect") {
        if (node.rx && node.ry) {
            node.shape = "roundedRect";
        } else {
            node.shape = "squareRect";
        }
    }
    const shapeHandler = node.shape ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$4HAMMTFA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shapes"][node.shape] : void 0;
    if (!shapeHandler) {
        throw new Error(`No such shape: ${node.shape}. Please check your syntax.`);
    }
    if (node.link) {
        let target;
        if (renderOptions.config.securityLevel === "sandbox") {
            target = "_top";
        } else if (node.linkTarget) {
            target = node.linkTarget || "_blank";
        }
        newEl = elem.insert("svg:a").attr("xlink:href", node.link).attr("target", target ?? null);
        el = await shapeHandler(newEl, node, renderOptions);
    } else {
        el = await shapeHandler(elem, node, renderOptions);
        newEl = el;
    }
    newEl.attr("data-look", (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$75Z2AOVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleUndefinedAttr"])(node.look));
    if (node.tooltip) {
        el.attr("title", node.tooltip);
    }
    nodeElems.set(node.id, newEl);
    if (node.haveCallback) {
        newEl.attr("class", newEl.attr("class") + " clickable");
    }
    return newEl;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(insertNode, "insertNode");
var setNodeElem = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((elem, node)=>{
    nodeElems.set(node.id, elem);
}, "setNodeElem");
var clear = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>{
    nodeElems.clear();
}, "clear");
var positionNode = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((node)=>{
    const el = nodeElems.get(node.id);
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].trace("Transforming node", node.diff, node, "translate(" + (node.x - node.width / 2 - 5) + ", " + node.width / 2 + ")");
    const padding = 8;
    const diff = node.diff || 0;
    if (node.clusterNode) {
        el.attr("transform", "translate(" + (node.x + diff - node.width / 2) + ", " + (node.y - node.height / 2 - padding) + ")");
    } else {
        el.attr("transform", "translate(" + node.x + ", " + node.y + ")");
    }
    return diff;
}, "positionNode");
;
}),
"[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-L3NEJ4N5.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clear",
    ()=>clear,
    "insertCluster",
    ()=>insertCluster
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$GVQU2GXP$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-GVQU2GXP.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$4HAMMTFA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-4HAMMTFA.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$P2QGCYS3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-P2QGCYS3.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$GMAD6QVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-GMAD6QVW.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-DU6HZSFF.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-X3CZISLH.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-Y2CYZVJY.mjs [app-client] (ecmascript)");
// src/rendering-util/rendering-elements/clusters.js
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3/src/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/select.js [app-client] (ecmascript) <export default as select>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$roughjs$2f$bundled$2f$rough$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/roughjs/bundled/rough.esm.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
var swimlane = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(async (parent, node)=>{
    const siteConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig2"])();
    const { themeVariables, handDrawnSeed } = siteConfig;
    const { clusterBkg, clusterBorder } = themeVariables;
    const laneStroke = clusterBorder;
    const { labelStyles, nodeStyles, borderStyles, backgroundStyles } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$P2QGCYS3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["styles2String"])(node);
    const shapeSvg = parent.insert("g").attr("class", "cluster swimlane " + (node.cssClasses || "")).attr("id", node.id).attr("data-id", node.id).attr("data-et", "cluster").attr("data-look", node.look);
    const useHtmlLabels = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["evaluate"])(siteConfig.flowchart.htmlLabels);
    const isLR = node.direction === "LR";
    const labelEl = shapeSvg.insert("g").attr("class", "cluster-label swimlane-label");
    const text = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$GMAD6QVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createText"])(labelEl, node.label, {
        style: node.labelStyle,
        useHtmlLabels,
        isNode: true,
        width: node.width
    });
    let bbox = text.getBBox();
    if (useHtmlLabels) {
        const div = text.children[0];
        const dv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(text);
        bbox = div.getBoundingClientRect();
        dv.attr("width", bbox.width);
        dv.attr("height", bbox.height);
    }
    const padding = node.padding ?? 0;
    const width = node.width <= bbox.width + padding ? bbox.width + padding : node.width;
    if (node.width <= bbox.width + padding) {
        node.diff = (width - node.width) / 2 - padding;
    } else {
        node.diff = -padding;
    }
    const height = node.height;
    const laneTop = node.y - height / 2;
    const laneBottom = node.y + height / 2;
    const laneLeft = node.x - width / 2;
    const contentTop = node.swimlaneContentTop !== void 0 ? node.swimlaneContentTop : laneTop + height / 3;
    const titlePaddingY = isLR ? 4 : 0;
    const desiredTitleSize = bbox.height + 2 * titlePaddingY;
    let titleRect;
    let bodyRect;
    if (isLR) {
        const titleWidth = Math.max(desiredTitleSize, bbox.height + 2 * titlePaddingY);
        const bodyX = laneLeft + titleWidth;
        const bodyWidth = Math.max(0, width - titleWidth);
        if (node.look === "handDrawn") {
            const rc = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$roughjs$2f$bundled$2f$rough$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].svg(shapeSvg);
            const titleOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$P2QGCYS3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userNodeOverrides"])(node, {
                roughness: 0.7,
                fill: clusterBkg,
                stroke: laneStroke,
                fillWeight: 3,
                seed: handDrawnSeed
            });
            const bodyOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$P2QGCYS3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userNodeOverrides"])(node, {
                roughness: 0.7,
                fill: "none",
                stroke: laneStroke,
                seed: handDrawnSeed
            });
            const roughTitle = rc.rectangle(laneLeft, laneTop, titleWidth, height, titleOptions);
            titleRect = shapeSvg.insert(()=>roughTitle, ":first-child");
            const roughBody = rc.rectangle(bodyX, laneTop, bodyWidth, height, bodyOptions);
            bodyRect = shapeSvg.insert(()=>roughBody, ":first-child");
            titleRect.select("path:nth-child(2)").attr("style", borderStyles.join(";"));
            titleRect.select("path").attr("style", backgroundStyles.join(";").replace("fill", "stroke"));
        } else {
            titleRect = shapeSvg.insert("rect", ":first-child");
            bodyRect = shapeSvg.insert("rect", ":first-child");
            titleRect.attr("class", "swimlane-title").attr("style", nodeStyles).attr("x", laneLeft).attr("y", laneTop).attr("width", titleWidth).attr("height", height).attr("fill", clusterBkg).attr("stroke", laneStroke);
            bodyRect.attr("class", "swimlane-body").attr("style", nodeStyles).attr("x", bodyX).attr("y", laneTop).attr("width", bodyWidth).attr("height", height).attr("fill", "none").attr("stroke", laneStroke);
        }
        const labelCenterX = laneLeft + titleWidth / 2;
        const labelCenterY = node.y;
        labelEl.attr("transform", `translate(${labelCenterX}, ${labelCenterY}) rotate(-90) translate(${-bbox.width / 2}, ${-bbox.height / 2})`);
    } else {
        const headerMaxHeight = Math.max(0, contentTop - laneTop);
        const titleHeight = Math.min(desiredTitleSize, headerMaxHeight);
        const bodyY = laneTop + titleHeight;
        const contentHeight = Math.max(0, laneBottom - bodyY);
        const x = node.x - width / 2;
        if (node.look === "handDrawn") {
            const rc = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$roughjs$2f$bundled$2f$rough$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].svg(shapeSvg);
            const titleOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$P2QGCYS3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userNodeOverrides"])(node, {
                roughness: 0.7,
                fill: clusterBkg,
                stroke: laneStroke,
                fillWeight: 3,
                seed: handDrawnSeed
            });
            const bodyOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$P2QGCYS3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userNodeOverrides"])(node, {
                roughness: 0.7,
                fill: "none",
                stroke: laneStroke,
                seed: handDrawnSeed
            });
            const roughTitle = rc.rectangle(x, laneTop, width, titleHeight, titleOptions);
            titleRect = shapeSvg.insert(()=>roughTitle, ":first-child");
            const roughBody = rc.rectangle(x, bodyY, width, contentHeight, bodyOptions);
            bodyRect = shapeSvg.insert(()=>roughBody, ":first-child");
            titleRect.select("path:nth-child(2)").attr("style", borderStyles.join(";"));
            titleRect.select("path").attr("style", backgroundStyles.join(";").replace("fill", "stroke"));
        } else {
            titleRect = shapeSvg.insert("rect", ":first-child");
            bodyRect = shapeSvg.insert("rect", ":first-child");
            titleRect.attr("class", "swimlane-title").attr("style", nodeStyles).attr("x", x).attr("y", laneTop).attr("width", width).attr("height", titleHeight).attr("fill", clusterBkg).attr("stroke", laneStroke);
            bodyRect.attr("class", "swimlane-body").attr("style", nodeStyles).attr("x", x).attr("y", bodyY).attr("width", width).attr("height", contentHeight).attr("fill", "none").attr("stroke", laneStroke);
        }
        const labelX = node.x - bbox.width / 2;
        const labelY = laneTop + (titleHeight - bbox.height) / 2;
        labelEl.attr("transform", `translate(${labelX}, ${labelY})`);
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].trace("Swimlane data ", node, JSON.stringify(node));
    if (labelStyles) {
        const span = labelEl.select("span");
        if (span) {
            span.attr("style", labelStyles);
        }
    }
    node.offsetX = 0;
    node.width = width;
    node.height = height;
    node.offsetY = bbox.height - padding / 2;
    node.intersect = function(point) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$4HAMMTFA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intersect_rect_default"])(node, point);
    };
    return {
        cluster: shapeSvg,
        labelBBox: bbox
    };
}, "swimlane");
// src/rendering-util/rendering-elements/clusters.js
var rect = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(async (parent, node)=>{
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].info("Creating subgraph rect for ", node.id, node);
    const siteConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig2"])();
    const { themeVariables, handDrawnSeed } = siteConfig;
    const { clusterBkg, clusterBorder } = themeVariables;
    const { labelStyles, nodeStyles, borderStyles, backgroundStyles } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$P2QGCYS3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["styles2String"])(node);
    const shapeSvg = parent.insert("g").attr("class", "cluster " + node.cssClasses).attr("id", node.domId).attr("data-look", node.look);
    const useHtmlLabels = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEffectiveHtmlLabels"])(siteConfig);
    const labelEl = shapeSvg.insert("g").attr("class", "cluster-label ");
    let text;
    if (node.labelType === "markdown") {
        text = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$GMAD6QVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createText"])(labelEl, node.label, {
            style: node.labelStyle,
            useHtmlLabels,
            isNode: true,
            width: node.width
        });
    } else {
        text = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$4HAMMTFA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createLabel_default"])(labelEl, node.label, node.labelStyle || "", false, true);
    }
    let bbox = text.getBBox();
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEffectiveHtmlLabels"])(siteConfig)) {
        const div = text.children[0];
        const dv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(text);
        bbox = div.getBoundingClientRect();
        dv.attr("width", bbox.width);
        dv.attr("height", bbox.height);
    }
    const width = node.width <= bbox.width + node.padding ? bbox.width + node.padding : node.width;
    if (node.width <= bbox.width + node.padding) {
        node.diff = (width - node.width) / 2 - node.padding;
    } else {
        node.diff = -node.padding;
    }
    const height = node.height;
    const x = node.x - width / 2;
    const y = node.y - height / 2;
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].trace("Data ", node, JSON.stringify(node));
    let rect2;
    if (node.look === "handDrawn") {
        const rc = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$roughjs$2f$bundled$2f$rough$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].svg(shapeSvg);
        const options = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$P2QGCYS3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userNodeOverrides"])(node, {
            roughness: 0.7,
            fill: clusterBkg,
            // fill: 'red',
            stroke: clusterBorder,
            fillWeight: 3,
            seed: handDrawnSeed
        });
        const roughNode = rc.path((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$4HAMMTFA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRoundedRectPathD"])(x, y, width, height, 0), options);
        rect2 = shapeSvg.insert(()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Rough node insert CXC", roughNode);
            return roughNode;
        }, ":first-child");
        rect2.select("path:nth-child(2)").attr("style", borderStyles.join(";"));
        rect2.select("path").attr("style", backgroundStyles.join(";").replace("fill", "stroke"));
    } else {
        rect2 = shapeSvg.insert("rect", ":first-child");
        rect2.attr("style", nodeStyles).attr("rx", node.rx).attr("ry", node.ry).attr("x", x).attr("y", y).attr("width", width).attr("height", height);
    }
    const { subGraphTitleTopMargin } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$GVQU2GXP$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSubGraphTitleMargins"])(siteConfig);
    labelEl.attr("transform", // This puts the label on top of the box instead of inside it
    `translate(${node.x - bbox.width / 2}, ${node.y - node.height / 2 + subGraphTitleTopMargin})`);
    if (labelStyles) {
        const span = labelEl.select("span");
        if (span) {
            span.attr("style", labelStyles);
        }
    }
    const rectBox = rect2.node().getBBox();
    node.offsetX = 0;
    node.width = rectBox.width;
    node.height = rectBox.height;
    node.offsetY = bbox.height - node.padding / 2;
    node.intersect = function(point) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$4HAMMTFA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intersect_rect_default"])(node, point);
    };
    return {
        cluster: shapeSvg,
        labelBBox: bbox
    };
}, "rect");
var noteGroup = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((parent, node)=>{
    const shapeSvg = parent.insert("g").attr("class", "note-cluster").attr("id", node.domId);
    const rect2 = shapeSvg.insert("rect", ":first-child");
    const padding = 0 * node.padding;
    const halfPadding = padding / 2;
    rect2.attr("rx", node.rx).attr("ry", node.ry).attr("x", node.x - node.width / 2 - halfPadding).attr("y", node.y - node.height / 2 - halfPadding).attr("width", node.width + padding).attr("height", node.height + padding).attr("fill", "none");
    const rectBox = rect2.node().getBBox();
    node.width = rectBox.width;
    node.height = rectBox.height;
    node.intersect = function(point) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$4HAMMTFA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intersect_rect_default"])(node, point);
    };
    return {
        cluster: shapeSvg,
        labelBBox: {
            width: 0,
            height: 0
        }
    };
}, "noteGroup");
var roundedWithTitle = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(async (parent, node)=>{
    const siteConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig2"])();
    const { themeVariables, handDrawnSeed } = siteConfig;
    const { altBackground, compositeBackground, compositeTitleBackground, nodeBorder } = themeVariables;
    const shapeSvg = parent.insert("g").attr("class", node.cssClasses).attr("id", node.domId).attr("data-id", node.id).attr("data-look", node.look);
    const outerRectG = shapeSvg.insert("g", ":first-child");
    const label = shapeSvg.insert("g").attr("class", "cluster-label");
    let innerRect = shapeSvg.append("rect");
    const text = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$4HAMMTFA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createLabel_default"])(label, node.label, node.labelStyle, void 0, true);
    let bbox = text.getBBox();
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEffectiveHtmlLabels"])(siteConfig)) {
        const div = text.children[0];
        const dv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(text);
        bbox = div.getBoundingClientRect();
        dv.attr("width", bbox.width);
        dv.attr("height", bbox.height);
    }
    const padding = 0 * node.padding;
    const halfPadding = padding / 2;
    const width = (node.width <= bbox.width + node.padding ? bbox.width + node.padding : node.width) + padding;
    if (node.width <= bbox.width + node.padding) {
        node.diff = (width - node.width) / 2 - node.padding;
    } else {
        node.diff = -node.padding;
    }
    const height = node.height + padding;
    const innerHeight = node.height + padding - bbox.height - 6;
    const x = node.x - width / 2;
    const y = node.y - height / 2;
    node.width = width;
    const innerY = node.y - node.height / 2 - halfPadding + bbox.height + 2;
    let rect2;
    if (node.look === "handDrawn") {
        const isAlt = node.cssClasses.includes("statediagram-cluster-alt");
        const rc = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$roughjs$2f$bundled$2f$rough$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].svg(shapeSvg);
        const roughOuterNode = node.rx || node.ry ? rc.path((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$4HAMMTFA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRoundedRectPathD"])(x, y, width, height, 10), {
            roughness: 0.7,
            fill: compositeTitleBackground,
            fillStyle: "solid",
            stroke: nodeBorder,
            seed: handDrawnSeed
        }) : rc.rectangle(x, y, width, height, {
            seed: handDrawnSeed
        });
        rect2 = shapeSvg.insert(()=>roughOuterNode, ":first-child");
        const roughInnerNode = rc.rectangle(x, innerY, width, innerHeight, {
            fill: isAlt ? altBackground : compositeBackground,
            fillStyle: isAlt ? "hachure" : "solid",
            stroke: nodeBorder,
            seed: handDrawnSeed
        });
        rect2 = shapeSvg.insert(()=>roughOuterNode, ":first-child");
        innerRect = shapeSvg.insert(()=>roughInnerNode);
    } else {
        rect2 = outerRectG.insert("rect", ":first-child");
        const outerRectClass = "outer";
        rect2.attr("class", outerRectClass).attr("x", x).attr("y", y).attr("width", width).attr("height", height).attr("data-look", node.look);
        innerRect.attr("class", "inner").attr("x", x).attr("y", innerY).attr("width", width).attr("height", innerHeight);
    }
    label.attr("transform", `translate(${node.x - bbox.width / 2}, ${y + 1 - ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEffectiveHtmlLabels"])(siteConfig) ? 0 : 3)})`);
    const rectBox = rect2.node().getBBox();
    node.height = rectBox.height;
    node.offsetX = 0;
    node.offsetY = bbox.height - node.padding / 2;
    node.labelBBox = bbox;
    node.intersect = function(point) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$4HAMMTFA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intersect_rect_default"])(node, point);
    };
    return {
        cluster: shapeSvg,
        labelBBox: bbox
    };
}, "roundedWithTitle");
var kanbanSection = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(async (parent, node)=>{
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].info("Creating subgraph rect for ", node.id, node);
    const siteConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig2"])();
    const { themeVariables, handDrawnSeed } = siteConfig;
    const { clusterBkg, clusterBorder } = themeVariables;
    const { labelStyles, nodeStyles, borderStyles, backgroundStyles } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$P2QGCYS3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["styles2String"])(node);
    const shapeSvg = parent.insert("g").attr("class", "cluster " + node.cssClasses).attr("id", node.domId).attr("data-look", node.look);
    const useHtmlLabels = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEffectiveHtmlLabels"])(siteConfig);
    const labelEl = shapeSvg.insert("g").attr("class", "cluster-label ");
    const text = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$GMAD6QVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createText"])(labelEl, node.label, {
        style: node.labelStyle,
        useHtmlLabels,
        isNode: true,
        width: node.width
    });
    let bbox = text.getBBox();
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEffectiveHtmlLabels"])(siteConfig)) {
        const div = text.children[0];
        const dv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(text);
        bbox = div.getBoundingClientRect();
        dv.attr("width", bbox.width);
        dv.attr("height", bbox.height);
    }
    const width = node.width <= bbox.width + node.padding ? bbox.width + node.padding : node.width;
    if (node.width <= bbox.width + node.padding) {
        node.diff = (width - node.width) / 2 - node.padding;
    } else {
        node.diff = -node.padding;
    }
    const height = node.height;
    const x = node.x - width / 2;
    const y = node.y - height / 2;
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].trace("Data ", node, JSON.stringify(node));
    let rect2;
    if (node.look === "handDrawn") {
        const rc = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$roughjs$2f$bundled$2f$rough$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].svg(shapeSvg);
        const options = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$P2QGCYS3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userNodeOverrides"])(node, {
            roughness: 0.7,
            fill: clusterBkg,
            // fill: 'red',
            stroke: clusterBorder,
            fillWeight: 4,
            seed: handDrawnSeed
        });
        const roughNode = rc.path((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$4HAMMTFA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRoundedRectPathD"])(x, y, width, height, node.rx), options);
        rect2 = shapeSvg.insert(()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Rough node insert CXC", roughNode);
            return roughNode;
        }, ":first-child");
        rect2.select("path:nth-child(2)").attr("style", borderStyles.join(";"));
        rect2.select("path").attr("style", backgroundStyles.join(";").replace("fill", "stroke"));
    } else {
        rect2 = shapeSvg.insert("rect", ":first-child");
        rect2.attr("style", nodeStyles).attr("rx", node.rx).attr("ry", node.ry).attr("x", x).attr("y", y).attr("width", width).attr("height", height);
    }
    const { subGraphTitleTopMargin } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$GVQU2GXP$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSubGraphTitleMargins"])(siteConfig);
    labelEl.attr("transform", // This puts the label on top of the box instead of inside it
    `translate(${node.x - bbox.width / 2}, ${node.y - node.height / 2 + subGraphTitleTopMargin})`);
    if (labelStyles) {
        const span = labelEl.select("span");
        if (span) {
            span.attr("style", labelStyles);
        }
    }
    const rectBox = rect2.node().getBBox();
    node.offsetX = 0;
    node.width = rectBox.width;
    node.height = rectBox.height;
    node.offsetY = bbox.height - node.padding / 2;
    node.intersect = function(point) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$4HAMMTFA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intersect_rect_default"])(node, point);
    };
    return {
        cluster: shapeSvg,
        labelBBox: bbox
    };
}, "kanbanSection");
var divider = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((parent, node)=>{
    const siteConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig2"])();
    const { themeVariables, handDrawnSeed } = siteConfig;
    const { nodeBorder } = themeVariables;
    const shapeSvg = parent.insert("g").attr("class", node.cssClasses).attr("id", node.domId).attr("data-look", node.look);
    const outerRectG = shapeSvg.insert("g", ":first-child");
    const padding = 0 * node.padding;
    const width = node.width + padding;
    node.diff = -node.padding;
    const height = node.height + padding;
    const x = node.x - width / 2;
    const y = node.y - height / 2;
    node.width = width;
    let rect2;
    if (node.look === "handDrawn") {
        const rc = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$roughjs$2f$bundled$2f$rough$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].svg(shapeSvg);
        const roughOuterNode = rc.rectangle(x, y, width, height, {
            fill: "lightgrey",
            roughness: 0.5,
            strokeLineDash: [
                5
            ],
            stroke: nodeBorder,
            seed: handDrawnSeed
        });
        rect2 = shapeSvg.insert(()=>roughOuterNode, ":first-child");
    } else {
        rect2 = outerRectG.insert("rect", ":first-child");
        let outerRectClass = "outer";
        if (node.look === "neo") {
            outerRectClass = "divider";
        } else {
            outerRectClass = "divider";
        }
        rect2.attr("class", outerRectClass).attr("x", x).attr("y", y).attr("width", width).attr("height", height).attr("data-look", node.look);
    }
    const rectBox = rect2.node().getBBox();
    node.height = rectBox.height;
    node.offsetX = 0;
    node.offsetY = 0;
    node.intersect = function(point) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$4HAMMTFA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["intersect_rect_default"])(node, point);
    };
    return {
        cluster: shapeSvg,
        labelBBox: {}
    };
}, "divider");
var squareRect = rect;
var shapes = {
    rect,
    squareRect,
    roundedWithTitle,
    noteGroup,
    divider,
    kanbanSection,
    swimlane
};
var clusterElems = /* @__PURE__ */ new Map();
var insertCluster = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(async (elem, node)=>{
    const shape = node.shape || "rect";
    const cluster = await shapes[shape](elem, node);
    clusterElems.set(node.id, cluster);
    return cluster;
}, "insertCluster");
var clear = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>{
    clusterElems = /* @__PURE__ */ new Map();
}, "clear");
;
}),
"[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-OSK3NFVY.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clear",
    ()=>clear,
    "edgeLabels",
    ()=>edgeLabels,
    "hasEdgeLabel",
    ()=>hasEdgeLabel,
    "insertEdge",
    ()=>insertEdge,
    "insertEdgeLabel",
    ()=>insertEdgeLabel,
    "markerOffsets",
    ()=>markerOffsets,
    "markers_default",
    ()=>markers_default,
    "positionEdgeLabel",
    ()=>positionEdgeLabel,
    "terminalLabels",
    ()=>terminalLabels
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$GVQU2GXP$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-GVQU2GXP.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$4HAMMTFA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-4HAMMTFA.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$P2QGCYS3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-P2QGCYS3.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$GMAD6QVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-GMAD6QVW.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$75Z2AOVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-75Z2AOVW.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-DU6HZSFF.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-X3CZISLH.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-Y2CYZVJY.mjs [app-client] (ecmascript)");
// src/rendering-util/rendering-elements/edges.js
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3/src/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveBasis$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/basis.js [app-client] (ecmascript) <export default as curveBasis>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$linear$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveLinear$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/linear.js [app-client] (ecmascript) <export default as curveLinear>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCardinal$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/cardinal.js [app-client] (ecmascript) <export default as curveCardinal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$bump$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__bumpX__as__curveBumpX$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/bump.js [app-client] (ecmascript) <export bumpX as curveBumpX>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$bump$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__bumpY__as__curveBumpY$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/bump.js [app-client] (ecmascript) <export bumpY as curveBumpY>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$catmullRom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCatmullRom$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/catmullRom.js [app-client] (ecmascript) <export default as curveCatmullRom>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$monotone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__monotoneX__as__curveMonotoneX$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/monotone.js [app-client] (ecmascript) <export monotoneX as curveMonotoneX>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$monotone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__monotoneY__as__curveMonotoneY$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/monotone.js [app-client] (ecmascript) <export monotoneY as curveMonotoneY>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$natural$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveNatural$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/natural.js [app-client] (ecmascript) <export default as curveNatural>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$step$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveStep$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/step.js [app-client] (ecmascript) <export default as curveStep>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$step$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__stepAfter__as__curveStepAfter$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/step.js [app-client] (ecmascript) <export stepAfter as curveStepAfter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$step$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__stepBefore__as__curveStepBefore$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/curve/step.js [app-client] (ecmascript) <export stepBefore as curveStepBefore>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__line$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-shape/src/line.js [app-client] (ecmascript) <export default as line>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/select.js [app-client] (ecmascript) <export default as select>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$roughjs$2f$bundled$2f$rough$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/roughjs/bundled/rough.esm.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
// src/rendering-util/labelTransform.ts
var computeLabelTransform = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((bbox, useHtmlLabels)=>{
    if (useHtmlLabels) {
        return "translate(" + -bbox.width / 2 + ", " + -bbox.height / 2 + ")";
    }
    const x = bbox.x ?? 0;
    const y = bbox.y ?? 0;
    return "translate(" + -(x + bbox.width / 2) + ", " + -(y + bbox.height / 2) + ")";
}, "computeLabelTransform");
// src/utils/lineWithOffset.ts
var markerOffsets = {
    aggregation: 17.25,
    extension: 17.25,
    composition: 17.25,
    dependency: 6,
    lollipop: 13.5,
    arrow_point: 4,
    arrow_barb: 0,
    arrow_barb_neo: 5.5
};
var markerOffsets2 = {
    arrow_point: 4,
    arrow_cross: 12.5,
    arrow_circle: 12.5
};
function calculateDeltaAndAngle(point1, point2) {
    if (point1 === void 0 || point2 === void 0) {
        return {
            angle: 0,
            deltaX: 0,
            deltaY: 0
        };
    }
    point1 = pointTransformer(point1);
    point2 = pointTransformer(point2);
    const [x1, y1] = [
        point1.x,
        point1.y
    ];
    const [x2, y2] = [
        point2.x,
        point2.y
    ];
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    return {
        angle: Math.atan(deltaY / deltaX),
        deltaX,
        deltaY
    };
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(calculateDeltaAndAngle, "calculateDeltaAndAngle");
var pointTransformer = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((data)=>{
    if (Array.isArray(data)) {
        return {
            x: data[0],
            y: data[1]
        };
    }
    return data;
}, "pointTransformer");
var getLineFunctionsWithOffset = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((edge)=>{
    return {
        x: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(d, i, data) {
            let offset = 0;
            const DIRECTION = pointTransformer(data[0]).x < pointTransformer(data[data.length - 1]).x ? "left" : "right";
            if (i === 0 && Object.hasOwn(markerOffsets, edge.arrowTypeStart)) {
                const { angle, deltaX } = calculateDeltaAndAngle(data[0], data[1]);
                offset = markerOffsets[edge.arrowTypeStart] * Math.cos(angle) * (deltaX >= 0 ? 1 : -1);
            } else if (i === data.length - 1 && Object.hasOwn(markerOffsets, edge.arrowTypeEnd)) {
                const { angle, deltaX } = calculateDeltaAndAngle(data[data.length - 1], data[data.length - 2]);
                offset = markerOffsets[edge.arrowTypeEnd] * Math.cos(angle) * (deltaX >= 0 ? 1 : -1);
            }
            const differenceToEnd = Math.abs(pointTransformer(d).x - pointTransformer(data[data.length - 1]).x);
            const differenceInYEnd = Math.abs(pointTransformer(d).y - pointTransformer(data[data.length - 1]).y);
            const differenceToStart = Math.abs(pointTransformer(d).x - pointTransformer(data[0]).x);
            const differenceInYStart = Math.abs(pointTransformer(d).y - pointTransformer(data[0]).y);
            const startMarkerHeight = markerOffsets[edge.arrowTypeStart];
            const endMarkerHeight = markerOffsets[edge.arrowTypeEnd];
            const extraRoom = 1;
            if (differenceToEnd < endMarkerHeight && differenceToEnd > 0 && differenceInYEnd < endMarkerHeight) {
                let adjustment = endMarkerHeight + extraRoom - differenceToEnd;
                adjustment *= DIRECTION === "right" ? -1 : 1;
                offset -= adjustment;
            }
            if (differenceToStart < startMarkerHeight && differenceToStart > 0 && differenceInYStart < startMarkerHeight) {
                let adjustment = startMarkerHeight + extraRoom - differenceToStart;
                adjustment *= DIRECTION === "right" ? -1 : 1;
                offset += adjustment;
            }
            return pointTransformer(d).x + offset;
        }, "x"),
        y: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(d, i, data) {
            let offset = 0;
            const DIRECTION = pointTransformer(data[0]).y < pointTransformer(data[data.length - 1]).y ? "down" : "up";
            if (i === 0 && Object.hasOwn(markerOffsets, edge.arrowTypeStart)) {
                const { angle, deltaY } = calculateDeltaAndAngle(data[0], data[1]);
                offset = markerOffsets[edge.arrowTypeStart] * Math.abs(Math.sin(angle)) * (deltaY >= 0 ? 1 : -1);
            } else if (i === data.length - 1 && Object.hasOwn(markerOffsets, edge.arrowTypeEnd)) {
                const { angle, deltaY } = calculateDeltaAndAngle(data[data.length - 1], data[data.length - 2]);
                offset = markerOffsets[edge.arrowTypeEnd] * Math.abs(Math.sin(angle)) * (deltaY >= 0 ? 1 : -1);
            }
            const differenceToEnd = Math.abs(pointTransformer(d).y - pointTransformer(data[data.length - 1]).y);
            const differenceInXEnd = Math.abs(pointTransformer(d).x - pointTransformer(data[data.length - 1]).x);
            const differenceToStart = Math.abs(pointTransformer(d).y - pointTransformer(data[0]).y);
            const differenceInXStart = Math.abs(pointTransformer(d).x - pointTransformer(data[0]).x);
            const startMarkerHeight = markerOffsets[edge.arrowTypeStart];
            const endMarkerHeight = markerOffsets[edge.arrowTypeEnd];
            const extraRoom = 1;
            if (differenceToEnd < endMarkerHeight && differenceToEnd > 0 && differenceInXEnd < endMarkerHeight) {
                let adjustment = endMarkerHeight + extraRoom - differenceToEnd;
                adjustment *= DIRECTION === "up" ? -1 : 1;
                offset -= adjustment;
            }
            if (differenceToStart < startMarkerHeight && differenceToStart > 0 && differenceInXStart < startMarkerHeight) {
                let adjustment = startMarkerHeight + extraRoom - differenceToStart;
                adjustment *= DIRECTION === "up" ? -1 : 1;
                offset += adjustment;
            }
            return pointTransformer(d).y + offset;
        }, "y")
    };
}, "getLineFunctionsWithOffset");
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
;
;
// src/rendering-util/rendering-elements/edgeMarker.ts
var addEdgeMarkers = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((svgPath, edge, url, id, diagramType, useMargin = false, strokeColor)=>{
    if (edge.arrowTypeStart) {
        addEdgeMarker(svgPath, "start", edge.arrowTypeStart, url, id, diagramType, useMargin, strokeColor);
    }
    if (edge.arrowTypeEnd) {
        addEdgeMarker(svgPath, "end", edge.arrowTypeEnd, url, id, diagramType, useMargin, strokeColor);
    }
}, "addEdgeMarkers");
var arrowTypesMap = {
    arrow_cross: {
        type: "cross",
        fill: false
    },
    arrow_point: {
        type: "point",
        fill: true
    },
    arrow_barb: {
        type: "barb",
        fill: true
    },
    arrow_barb_neo: {
        type: "barb",
        fill: true
    },
    arrow_circle: {
        type: "circle",
        fill: false
    },
    aggregation: {
        type: "aggregation",
        fill: false
    },
    extension: {
        type: "extension",
        fill: false
    },
    composition: {
        type: "composition",
        fill: true
    },
    dependency: {
        type: "dependency",
        fill: true
    },
    lollipop: {
        type: "lollipop",
        fill: false
    },
    only_one: {
        type: "onlyOne",
        fill: false
    },
    zero_or_one: {
        type: "zeroOrOne",
        fill: false
    },
    one_or_more: {
        type: "oneOrMore",
        fill: false
    },
    zero_or_more: {
        type: "zeroOrMore",
        fill: false
    },
    requirement_arrow: {
        type: "requirement_arrow",
        fill: false
    },
    requirement_contains: {
        type: "requirement_contains",
        fill: false
    }
};
var arrowTypesWithMarginSupport = [
    "cross",
    "point",
    "circle",
    "lollipop",
    "aggregation",
    "extension",
    "composition",
    "dependency",
    "barb"
];
var addEdgeMarker = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((svgPath, position, arrowType, url, id, diagramType, useMargin = false, strokeColor)=>{
    if (!arrowType || arrowType === "none") {
        return;
    }
    const arrowTypeInfo = arrowTypesMap[arrowType];
    const marginSupport = arrowTypeInfo && arrowTypesWithMarginSupport.includes(arrowTypeInfo.type);
    if (!arrowTypeInfo) {
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].warn(`Unknown arrow type: ${arrowType}`);
        return;
    }
    const endMarkerType = arrowTypeInfo.type;
    const suffix = position === "start" ? "Start" : "End";
    const offset = useMargin && marginSupport ? "-margin" : "";
    const originalMarkerId = `${id}_${diagramType}-${endMarkerType}${suffix}${offset}`;
    if (strokeColor && strokeColor.trim() !== "") {
        const colorId = strokeColor.replace(/[^\dA-Za-z]/g, "_");
        const coloredMarkerId = `${originalMarkerId}_${colorId}`;
        if (!document.getElementById(coloredMarkerId)) {
            const originalMarker = document.getElementById(originalMarkerId);
            if (originalMarker) {
                const coloredMarker = originalMarker.cloneNode(true);
                coloredMarker.id = coloredMarkerId;
                const paths = coloredMarker.querySelectorAll("path, circle, line");
                paths.forEach((path)=>{
                    path.setAttribute("stroke", strokeColor);
                    if (arrowTypeInfo.fill) {
                        path.setAttribute("fill", strokeColor);
                    }
                });
                originalMarker.parentNode?.appendChild(coloredMarker);
            }
        }
        svgPath.attr(`marker-${position}`, `url(${url}#${coloredMarkerId})`);
    } else {
        svgPath.attr(`marker-${position}`, `url(${url}#${originalMarkerId})`);
    }
}, "addEdgeMarker");
// src/rendering-util/rendering-elements/edges.js
var resolveEdgeCurveType = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((edgeCurve)=>{
    return typeof edgeCurve === "string" ? edgeCurve : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig2"])()?.flowchart?.curve;
}, "resolveEdgeCurveType");
var edgeLabels = /* @__PURE__ */ new Map();
var terminalLabels = /* @__PURE__ */ new Map();
var clear = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>{
    edgeLabels.clear();
    terminalLabels.clear();
}, "clear");
var hasEdgeLabel = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((edge)=>Boolean(edge.label || edge.startLabelLeft || edge.startLabelRight || edge.endLabelLeft || edge.endLabelRight), "hasEdgeLabel");
var getLabelStyles = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((styleArray)=>{
    if (!styleArray) {
        return "";
    }
    if (typeof styleArray === "string") {
        return styleArray;
    }
    return styleArray.reduce((acc, style)=>acc + ";" + style, "");
}, "getLabelStyles");
var insertEdgeLabel = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(async (elem, edge)=>{
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig2"])();
    let useHtmlLabels = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEffectiveHtmlLabels"])(config);
    const { labelStyles } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$P2QGCYS3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["styles2String"])(edge);
    edge.labelStyle = labelStyles;
    const edgeLabel = elem.insert("g").attr("class", "edgeLabel");
    const label = edgeLabel.insert("g").attr("class", "label").attr("data-id", edge.id);
    const isMarkdown = edge.labelType === "markdown";
    const markdownWidth = void 0;
    const labelElement = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$GMAD6QVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createText"])(elem, edge.label, {
        style: getLabelStyles(edge.labelStyle),
        useHtmlLabels,
        addSvgBackground: true,
        isNode: false,
        markdown: isMarkdown,
        // Plain text edge labels should auto-wrap, markdown edge labels respect markdownAutoWrap config
        width: isMarkdown ? markdownWidth : void 0
    }, config);
    label.node().appendChild(labelElement);
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].info("abc82", edge, edge.labelType);
    let bbox;
    let transformBbox;
    if (useHtmlLabels) {
        const div = labelElement.children[0];
        const dv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(labelElement);
        bbox = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$GMAD6QVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fastdom_default"].measure(()=>div.getBoundingClientRect());
        transformBbox = bbox;
        dv.attr("width", bbox.width);
        dv.attr("height", bbox.height);
    } else {
        const textEl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(labelElement).select("text").node();
        await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$GMAD6QVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fastdom_default"].measure(()=>{
            bbox = labelElement.getBBox();
            if (textEl && typeof textEl.getBBox === "function") {
                transformBbox = textEl.getBBox();
            } else {
                transformBbox = bbox;
            }
        });
    }
    label.attr("transform", computeLabelTransform(transformBbox, useHtmlLabels));
    edgeLabels.set(edge.id, edgeLabel);
    edge.width = bbox.width;
    edge.height = bbox.height;
    let fo;
    if (edge.startLabelLeft) {
        const startEdgeLabelLeft = elem.insert("g").attr("class", "edgeTerminals");
        const inner = startEdgeLabelLeft.insert("g").attr("class", "inner");
        const startLabelElement = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$4HAMMTFA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createLabel_default"])(inner, edge.startLabelLeft, getLabelStyles(edge.labelStyle) || "", false, false);
        fo = startLabelElement;
        let slBox = startLabelElement.getBBox();
        if (useHtmlLabels) {
            const div = startLabelElement.children[0];
            const dv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(startLabelElement);
            slBox = div.getBoundingClientRect();
            dv.attr("width", slBox.width);
            dv.attr("height", slBox.height);
        }
        inner.attr("transform", computeLabelTransform(slBox, useHtmlLabels));
        if (!terminalLabels.get(edge.id)) {
            terminalLabels.set(edge.id, {});
        }
        terminalLabels.get(edge.id).startLeft = startEdgeLabelLeft;
        setTerminalWidth(fo, edge.startLabelLeft);
    }
    if (edge.startLabelRight) {
        const startEdgeLabelRight = elem.insert("g").attr("class", "edgeTerminals");
        const inner = startEdgeLabelRight.insert("g").attr("class", "inner");
        const startLabelElement = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$4HAMMTFA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createLabel_default"])(inner, edge.startLabelRight, getLabelStyles(edge.labelStyle) || "", false, false);
        fo = startLabelElement;
        let slBox = startLabelElement.getBBox();
        if (useHtmlLabels) {
            const div = startLabelElement.children[0];
            const dv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(startLabelElement);
            slBox = div.getBoundingClientRect();
            dv.attr("width", slBox.width);
            dv.attr("height", slBox.height);
        }
        inner.attr("transform", computeLabelTransform(slBox, useHtmlLabels));
        if (!terminalLabels.get(edge.id)) {
            terminalLabels.set(edge.id, {});
        }
        terminalLabels.get(edge.id).startRight = startEdgeLabelRight;
        setTerminalWidth(fo, edge.startLabelRight);
    }
    if (edge.endLabelLeft) {
        const endEdgeLabelLeft = elem.insert("g").attr("class", "edgeTerminals");
        const inner = endEdgeLabelLeft.insert("g").attr("class", "inner");
        const endLabelElement = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$4HAMMTFA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createLabel_default"])(endEdgeLabelLeft, edge.endLabelLeft, getLabelStyles(edge.labelStyle) || "", false, false);
        fo = endLabelElement;
        let slBox = endLabelElement.getBBox();
        if (useHtmlLabels) {
            const div = endLabelElement.children[0];
            const dv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(endLabelElement);
            slBox = div.getBoundingClientRect();
            dv.attr("width", slBox.width);
            dv.attr("height", slBox.height);
        }
        inner.attr("transform", computeLabelTransform(slBox, useHtmlLabels));
        if (!terminalLabels.get(edge.id)) {
            terminalLabels.set(edge.id, {});
        }
        terminalLabels.get(edge.id).endLeft = endEdgeLabelLeft;
        setTerminalWidth(fo, edge.endLabelLeft);
    }
    if (edge.endLabelRight) {
        const endEdgeLabelRight = elem.insert("g").attr("class", "edgeTerminals");
        const inner = endEdgeLabelRight.insert("g").attr("class", "inner");
        const endLabelElement = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$4HAMMTFA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createLabel_default"])(endEdgeLabelRight, edge.endLabelRight, getLabelStyles(edge.labelStyle) || "", false, false);
        fo = endLabelElement;
        let slBox = endLabelElement.getBBox();
        if (useHtmlLabels) {
            const div = endLabelElement.children[0];
            const dv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(endLabelElement);
            slBox = div.getBoundingClientRect();
            dv.attr("width", slBox.width);
            dv.attr("height", slBox.height);
        }
        inner.attr("transform", computeLabelTransform(slBox, useHtmlLabels));
        if (!terminalLabels.get(edge.id)) {
            terminalLabels.set(edge.id, {});
        }
        terminalLabels.get(edge.id).endRight = endEdgeLabelRight;
        setTerminalWidth(fo, edge.endLabelRight);
    }
    return labelElement;
}, "insertEdgeLabel");
function setTerminalWidth(fo, value) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEffectiveHtmlLabels"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig2"])()) && fo) {
        fo.style.width = value.length * 9 + "px";
        fo.style.height = "12px";
    }
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(setTerminalWidth, "setTerminalWidth");
var positionEdgeLabel = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((edge, paths)=>{
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Moving label abc88 ", edge.id, edge.label, edgeLabels.get(edge.id), paths);
    let path = paths.updatedPath ? paths.updatedPath : paths.originalPath;
    const siteConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig2"])();
    const { subGraphTitleTotalMargin } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$GVQU2GXP$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSubGraphTitleMargins"])(siteConfig);
    if (edge.label) {
        const el = edgeLabels.get(edge.id);
        let x = edge.x;
        let y = edge.y;
        if (path) {
            const pos = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$75Z2AOVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils_default"].calcLabelPosition(path);
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Moving label " + edge.label + " from (", x, ",", y, ") to (", pos.x, ",", pos.y, ") abc88");
            if (paths.updatedPath) {
                x = pos.x;
                y = pos.y;
            }
        }
        el.attr("transform", `translate(${x}, ${y + subGraphTitleTotalMargin / 2})`);
    }
    if (edge.startLabelLeft) {
        const el = terminalLabels.get(edge.id).startLeft;
        let x = edge.x;
        let y = edge.y;
        if (path) {
            const pos = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$75Z2AOVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils_default"].calcTerminalLabelPosition(edge.arrowTypeStart ? 10 : 0, "start_left", path);
            x = pos.x;
            y = pos.y;
        }
        el.attr("transform", `translate(${x}, ${y})`);
    }
    if (edge.startLabelRight) {
        const el = terminalLabels.get(edge.id).startRight;
        let x = edge.x;
        let y = edge.y;
        if (path) {
            const pos = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$75Z2AOVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils_default"].calcTerminalLabelPosition(edge.arrowTypeStart ? 10 : 0, "start_right", path);
            x = pos.x;
            y = pos.y;
        }
        el.attr("transform", `translate(${x}, ${y})`);
    }
    if (edge.endLabelLeft) {
        const el = terminalLabels.get(edge.id).endLeft;
        let x = edge.x;
        let y = edge.y;
        if (path) {
            const pos = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$75Z2AOVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils_default"].calcTerminalLabelPosition(edge.arrowTypeEnd ? 10 : 0, "end_left", path);
            x = pos.x;
            y = pos.y;
        }
        el.attr("transform", `translate(${x}, ${y})`);
    }
    if (edge.endLabelRight) {
        const el = terminalLabels.get(edge.id).endRight;
        let x = edge.x;
        let y = edge.y;
        if (path) {
            const pos = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$75Z2AOVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils_default"].calcTerminalLabelPosition(edge.arrowTypeEnd ? 10 : 0, "end_right", path);
            x = pos.x;
            y = pos.y;
        }
        el.attr("transform", `translate(${x}, ${y})`);
    }
}, "positionEdgeLabel");
var orthogonalizeToLabelClippedPoints = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((edge, points)=>{
    if (!edge?.isLabelEdge || !edge?.id?.endsWith("-to-label") || !Array.isArray(points)) {
        return points;
    }
    if (points.length !== 2) {
        return points;
    }
    const [start, end] = points;
    const dx = Math.abs(end.x - start.x);
    const dy = Math.abs(end.y - start.y);
    if (dx < 1e-3 || dy < 1e-3) {
        return points;
    }
    if (dy >= dx) {
        return [
            start,
            {
                x: start.x,
                y: end.y
            },
            end
        ];
    }
    return [
        start,
        {
            x: end.x,
            y: start.y
        },
        end
    ];
}, "orthogonalizeToLabelClippedPoints");
var outsideNode = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((node, point2)=>{
    const x = node.x;
    const y = node.y;
    const dx = Math.abs(point2.x - x);
    const dy = Math.abs(point2.y - y);
    const w = node.width / 2;
    const h = node.height / 2;
    return dx >= w || dy >= h;
}, "outsideNode");
var intersection = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((node, outsidePoint, insidePoint)=>{
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug(`intersection calc abc89:
  outsidePoint: ${JSON.stringify(outsidePoint)}
  insidePoint : ${JSON.stringify(insidePoint)}
  node        : x:${node.x} y:${node.y} w:${node.width} h:${node.height}`);
    const x = node.x;
    const y = node.y;
    const dx = Math.abs(x - insidePoint.x);
    const w = node.width / 2;
    let r = insidePoint.x < outsidePoint.x ? w - dx : w + dx;
    const h = node.height / 2;
    const Q = Math.abs(outsidePoint.y - insidePoint.y);
    const R = Math.abs(outsidePoint.x - insidePoint.x);
    if (Math.abs(y - outsidePoint.y) * w > Math.abs(x - outsidePoint.x) * h) {
        let q = insidePoint.y < outsidePoint.y ? outsidePoint.y - h - y : y - h - outsidePoint.y;
        r = R * q / Q;
        const res = {
            x: insidePoint.x < outsidePoint.x ? insidePoint.x + r : insidePoint.x - R + r,
            y: insidePoint.y < outsidePoint.y ? insidePoint.y + Q - q : insidePoint.y - Q + q
        };
        if (r === 0) {
            res.x = outsidePoint.x;
            res.y = outsidePoint.y;
        }
        if (R === 0) {
            res.x = outsidePoint.x;
        }
        if (Q === 0) {
            res.y = outsidePoint.y;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug(`abc89 top/bottom calc, Q ${Q}, q ${q}, R ${R}, r ${r}`, res);
        return res;
    } else {
        if (insidePoint.x < outsidePoint.x) {
            r = outsidePoint.x - w - x;
        } else {
            r = x - w - outsidePoint.x;
        }
        let q = Q * r / R;
        let _x = insidePoint.x < outsidePoint.x ? insidePoint.x + R - r : insidePoint.x - R + r;
        let _y = insidePoint.y < outsidePoint.y ? insidePoint.y + q : insidePoint.y - q;
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug(`sides calc abc89, Q ${Q}, q ${q}, R ${R}, r ${r}`, {
            _x,
            _y
        });
        if (r === 0) {
            _x = outsidePoint.x;
            _y = outsidePoint.y;
        }
        if (R === 0) {
            _x = outsidePoint.x;
        }
        if (Q === 0) {
            _y = outsidePoint.y;
        }
        return {
            x: _x,
            y: _y
        };
    }
}, "intersection");
var cutPathAtIntersect = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((_points, boundaryNode)=>{
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].warn("abc88 cutPathAtIntersect", _points, boundaryNode);
    let points = [];
    let lastPointOutside = _points[0];
    let isInside = false;
    _points.forEach((point2)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].info("abc88 checking point", point2, boundaryNode);
        if (!outsideNode(boundaryNode, point2) && !isInside) {
            const inter = intersection(boundaryNode, lastPointOutside, point2);
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("abc88 inside", point2, lastPointOutside, inter);
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("abc88 intersection", inter, boundaryNode);
            let pointPresent = false;
            points.forEach((p)=>{
                pointPresent = pointPresent || p.x === inter.x && p.y === inter.y;
            });
            if (!points.some((e)=>e.x === inter.x && e.y === inter.y)) {
                points.push(inter);
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].warn("abc88 no intersect", inter, points);
            }
            isInside = true;
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].warn("abc88 outside", point2, lastPointOutside);
            lastPointOutside = point2;
            if (!isInside) {
                points.push(point2);
            }
        }
    });
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("returning points", points);
    return points;
}, "cutPathAtIntersect");
function extractCornerPoints(points) {
    const cornerPoints = [];
    const cornerPointPositions = [];
    for(let i = 1; i < points.length - 1; i++){
        const prev = points[i - 1];
        const curr = points[i];
        const next = points[i + 1];
        if (prev.x === curr.x && curr.y === next.y && Math.abs(curr.x - next.x) > 5 && Math.abs(curr.y - prev.y) > 5) {
            cornerPoints.push(curr);
            cornerPointPositions.push(i);
        } else if (prev.y === curr.y && curr.x === next.x && Math.abs(curr.x - prev.x) > 5 && Math.abs(curr.y - next.y) > 5) {
            cornerPoints.push(curr);
            cornerPointPositions.push(i);
        }
    }
    return {
        cornerPoints,
        cornerPointPositions
    };
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(extractCornerPoints, "extractCornerPoints");
var findAdjacentPoint = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(pointA, pointB, distance) {
    const xDiff = pointB.x - pointA.x;
    const yDiff = pointB.y - pointA.y;
    const length = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    const ratio = distance / length;
    return {
        x: pointB.x - ratio * xDiff,
        y: pointB.y - ratio * yDiff
    };
}, "findAdjacentPoint");
var fixCorners = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(lineData) {
    const { cornerPointPositions } = extractCornerPoints(lineData);
    const newLineData = [];
    for(let i = 0; i < lineData.length; i++){
        if (cornerPointPositions.includes(i)) {
            const prevPoint = lineData[i - 1];
            const nextPoint = lineData[i + 1];
            const cornerPoint = lineData[i];
            const newPrevPoint = findAdjacentPoint(prevPoint, cornerPoint, 5);
            const newNextPoint = findAdjacentPoint(nextPoint, cornerPoint, 5);
            const xDiff = newNextPoint.x - newPrevPoint.x;
            const yDiff = newNextPoint.y - newPrevPoint.y;
            newLineData.push(newPrevPoint);
            const a = Math.sqrt(2) * 2;
            let newCornerPoint = {
                x: cornerPoint.x,
                y: cornerPoint.y
            };
            if (Math.abs(nextPoint.x - prevPoint.x) > 10 && Math.abs(nextPoint.y - prevPoint.y) >= 10) {
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Corner point fixing", Math.abs(nextPoint.x - prevPoint.x), Math.abs(nextPoint.y - prevPoint.y));
                const r = 5;
                if (cornerPoint.x === newPrevPoint.x) {
                    newCornerPoint = {
                        x: xDiff < 0 ? newPrevPoint.x - r + a : newPrevPoint.x + r - a,
                        y: yDiff < 0 ? newPrevPoint.y - a : newPrevPoint.y + a
                    };
                } else {
                    newCornerPoint = {
                        x: xDiff < 0 ? newPrevPoint.x - a : newPrevPoint.x + a,
                        y: yDiff < 0 ? newPrevPoint.y - r + a : newPrevPoint.y + r - a
                    };
                }
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Corner point skipping fixing", Math.abs(nextPoint.x - prevPoint.x), Math.abs(nextPoint.y - prevPoint.y));
            }
            newLineData.push(newCornerPoint, newNextPoint);
        } else {
            newLineData.push(lineData[i]);
        }
    }
    return newLineData;
}, "fixCorners");
var generateDashArray = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((len, oValueS, oValueE)=>{
    const middleLength = len - oValueS - oValueE;
    const dashLength = 2;
    const gapLength = 2;
    const dashGapPairLength = dashLength + gapLength;
    const rawPairs = Math.floor(middleLength / dashGapPairLength);
    const numberOfPairs = Number.isFinite(rawPairs) ? Math.max(0, rawPairs) : 0;
    const middlePattern = Array(numberOfPairs).fill(`${dashLength} ${gapLength}`).join(" ");
    const dashArray = `0 ${oValueS} ${middlePattern} ${oValueE}`;
    return dashArray;
}, "generateDashArray");
var insertEdge = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(elem, edge, clusterDb, diagramType, startNode, endNode, diagramId, skipIntersect = false) {
    if (!diagramId) {
        throw new Error(`insertEdge: missing diagramId for edge "${edge.id}" \u2014 edge IDs require a diagram prefix for uniqueness`);
    }
    const { handDrawnSeed, layout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig2"])();
    let points = edge.points;
    let pointsHasChanged = false;
    const tail = startNode;
    var head = endNode;
    const edgeClassStyles = [];
    for(const key in edge.cssCompiledStyles){
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$P2QGCYS3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLabelStyle"])(key)) {
            continue;
        }
        edgeClassStyles.push(edge.cssCompiledStyles[key]);
    }
    if (layout === "swimlane") {
        if (head.intersect && tail.intersect && Array.isArray(points) && points.length >= 2) {
            if (points.length === 2) {
                points = [
                    tail.intersect(points[0]),
                    head.intersect(points[1])
                ];
            } else {
                const innerPoints = points.slice(1, -1);
                const firstInner = innerPoints[0];
                const lastInner = innerPoints[innerPoints.length - 1];
                const TOLERANCE = 0.5;
                const lastIsPinned = Math.abs(points[points.length - 1].x - lastInner.x) < TOLERANCE && Math.abs(points[points.length - 1].y - lastInner.y) < TOLERANCE;
                const newFirst = tail.intersect(firstInner);
                const newLast = lastIsPinned ? lastInner : head.intersect(lastInner);
                const lastIsDuplicate = Math.abs(newLast.x - lastInner.x) < TOLERANCE && Math.abs(newLast.y - lastInner.y) < TOLERANCE;
                const firstIsDuplicate = Math.abs(newFirst.x - firstInner.x) < TOLERANCE && Math.abs(newFirst.y - firstInner.y) < TOLERANCE;
                const startPoints = firstIsDuplicate ? [] : [
                    newFirst
                ];
                const endPoints = lastIsDuplicate ? [] : [
                    newLast
                ];
                points = [
                    ...startPoints,
                    ...innerPoints,
                    ...endPoints
                ];
            }
        }
        points = orthogonalizeToLabelClippedPoints(edge, points);
    } else if (head.intersect && tail.intersect && !skipIntersect) {
        points = points.slice(1, edge.points.length - 1);
        points.unshift(tail.intersect(points[0]));
        points.push(head.intersect(points[points.length - 1]));
    }
    const pointsStr = btoa(JSON.stringify(points));
    if (edge.toCluster) {
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].info("to cluster abc88", clusterDb.get(edge.toCluster));
        points = cutPathAtIntersect(edge.points, clusterDb.get(edge.toCluster).node);
        pointsHasChanged = true;
    }
    if (edge.fromCluster) {
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("from cluster abc88", clusterDb.get(edge.fromCluster), JSON.stringify(points, null, 2));
        points = cutPathAtIntersect(points.reverse(), clusterDb.get(edge.fromCluster).node).reverse();
        pointsHasChanged = true;
    }
    let lineData = points.filter((p)=>!Number.isNaN(p.y));
    const edgeCurveType = resolveEdgeCurveType(edge.curve);
    if (edgeCurveType !== "rounded") {
        lineData = fixCorners(lineData);
    }
    let curve = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$linear$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveLinear$3e$__["curveLinear"];
    switch(edgeCurveType){
        case "linear":
            curve = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$linear$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveLinear$3e$__["curveLinear"];
            break;
        case "basis":
            curve = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveBasis$3e$__["curveBasis"];
            break;
        case "cardinal":
            curve = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$cardinal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCardinal$3e$__["curveCardinal"];
            break;
        case "bumpX":
            curve = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$bump$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__bumpX__as__curveBumpX$3e$__["curveBumpX"];
            break;
        case "bumpY":
            curve = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$bump$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__bumpY__as__curveBumpY$3e$__["curveBumpY"];
            break;
        case "catmullRom":
            curve = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$catmullRom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveCatmullRom$3e$__["curveCatmullRom"];
            break;
        case "monotoneX":
            curve = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$monotone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__monotoneX__as__curveMonotoneX$3e$__["curveMonotoneX"];
            break;
        case "monotoneY":
            curve = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$monotone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__monotoneY__as__curveMonotoneY$3e$__["curveMonotoneY"];
            break;
        case "natural":
            curve = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$natural$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveNatural$3e$__["curveNatural"];
            break;
        case "step":
            curve = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$step$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveStep$3e$__["curveStep"];
            break;
        case "stepAfter":
            curve = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$step$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__stepAfter__as__curveStepAfter$3e$__["curveStepAfter"];
            break;
        case "stepBefore":
            curve = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$step$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__stepBefore__as__curveStepBefore$3e$__["curveStepBefore"];
            break;
        case "rounded":
            curve = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$linear$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveLinear$3e$__["curveLinear"];
            break;
        default:
            curve = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$curve$2f$basis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__curveBasis$3e$__["curveBasis"];
    }
    const { x, y } = getLineFunctionsWithOffset(edge);
    const lineFunction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$shape$2f$src$2f$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__line$3e$__["line"])().x(x).y(y).curve(curve);
    let strokeClasses;
    switch(edge.thickness){
        case "normal":
            strokeClasses = "edge-thickness-normal";
            break;
        case "thick":
            strokeClasses = "edge-thickness-thick";
            break;
        case "invisible":
            strokeClasses = "edge-thickness-invisible";
            break;
        default:
            strokeClasses = "edge-thickness-normal";
    }
    switch(edge.pattern){
        case "solid":
            strokeClasses += " edge-pattern-solid";
            break;
        case "dotted":
            strokeClasses += " edge-pattern-dotted";
            break;
        case "dashed":
            strokeClasses += " edge-pattern-dashed";
            break;
        default:
            strokeClasses += " edge-pattern-solid";
    }
    let svgPath;
    let linePath = edgeCurveType === "rounded" ? generateRoundedPath(applyMarkerOffsetsToPoints(lineData, edge), 5) : lineFunction(lineData);
    const edgeStyles = Array.isArray(edge.style) ? edge.style : [
        edge.style
    ];
    let strokeColor = edgeStyles.find((style)=>style?.startsWith("stroke:"));
    let animationClass = "";
    if (edge.animate) {
        animationClass = "edge-animation-fast";
    }
    if (edge.animation) {
        animationClass = "edge-animation-" + edge.animation;
    }
    let animatedEdge = false;
    if (edge.look === "handDrawn") {
        const rc = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$roughjs$2f$bundled$2f$rough$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].svg(elem);
        Object.assign([], lineData);
        const svgPathNode = rc.path(linePath, {
            roughness: 0.3,
            seed: handDrawnSeed
        });
        strokeClasses += " transition";
        svgPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(svgPathNode).select("path").attr("id", `${diagramId}-${edge.id}`).attr("class", " " + strokeClasses + (edge.classes ? " " + edge.classes : "") + (animationClass ? " " + animationClass : "")).attr("style", edgeStyles ? edgeStyles.reduce((acc, style)=>acc + ";" + style, "") : "");
        let d = svgPath.attr("d");
        svgPath.attr("d", d);
        elem.node().appendChild(svgPath.node());
    } else {
        const stylesFromClasses = edgeClassStyles.join(";");
        const styles = edgeStyles ? edgeStyles.reduce((acc, style)=>acc + style + ";", "") : "";
        const pathStyle = (stylesFromClasses ? stylesFromClasses + ";" + styles + ";" : styles) + ";" + (edgeStyles ? edgeStyles.reduce((acc, style)=>acc + ";" + style, "") : "");
        svgPath = elem.append("path").attr("d", linePath).attr("id", `${diagramId}-${edge.id}`).attr("class", " " + strokeClasses + (edge.classes ? " " + edge.classes : "") + (animationClass ? " " + animationClass : "")).attr("style", pathStyle);
        strokeColor = pathStyle.match(/stroke:([^;]+)/)?.[1];
        animatedEdge = edge.animate === true || !!edge.animation || stylesFromClasses.includes("animation");
        const pathNode = svgPath.node();
        const len = typeof pathNode.getTotalLength === "function" ? pathNode.getTotalLength() : 0;
        const oValueS = markerOffsets2[edge.arrowTypeStart] || 0;
        const oValueE = markerOffsets2[edge.arrowTypeEnd] || 0;
        if (edge.look === "neo" && !animatedEdge) {
            const dashArray = edge.pattern === "dotted" || edge.pattern === "dashed" ? generateDashArray(len, oValueS, oValueE) : `0 ${oValueS} ${len - oValueS - oValueE} ${oValueE}`;
            const mOffset = `stroke-dasharray: ${dashArray}; stroke-dashoffset: 0;`;
            svgPath.attr("style", mOffset + svgPath.attr("style"));
        }
    }
    svgPath.attr("data-edge", true);
    svgPath.attr("data-et", "edge");
    svgPath.attr("data-id", edge.id);
    svgPath.attr("data-points", pointsStr);
    svgPath.attr("data-look", (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$75Z2AOVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleUndefinedAttr"])(edge.look));
    if (edge.showPoints) {
        lineData.forEach((point3)=>{
            elem.append("circle").style("stroke", "red").style("fill", "red").attr("r", 1).attr("cx", point3.x).attr("cy", point3.y);
        });
    }
    let url = "";
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig2"])().flowchart.arrowMarkerAbsolute || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig2"])().state.arrowMarkerAbsolute) {
        url = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search;
        url = url.replace(/\(/g, "\\(").replace(/\)/g, "\\)");
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].info("arrowTypeStart", edge.arrowTypeStart);
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].info("arrowTypeEnd", edge.arrowTypeEnd);
    const useMargin = !animatedEdge && edge?.look === "neo";
    addEdgeMarkers(svgPath, edge, url, diagramId, diagramType, useMargin, strokeColor);
    const midIndex = Math.floor(points.length / 2);
    const point2 = points[midIndex];
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$75Z2AOVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils_default"].isLabelCoordinateInPath(point2, svgPath.attr("d"))) {
        pointsHasChanged = true;
    }
    let paths = {};
    if (pointsHasChanged) {
        paths.updatedPath = points;
    }
    paths.originalPath = edge.points;
    return paths;
}, "insertEdge");
function generateRoundedPath(points, radius) {
    if (points.length < 2) {
        return "";
    }
    let path = "";
    const size = points.length;
    const epsilon = 1e-5;
    for(let i = 0; i < size; i++){
        const currPoint = points[i];
        const prevPoint = points[i - 1];
        const nextPoint = points[i + 1];
        if (i === 0) {
            path += `M${currPoint.x},${currPoint.y}`;
        } else if (i === size - 1) {
            path += `L${currPoint.x},${currPoint.y}`;
        } else {
            const dx1 = currPoint.x - prevPoint.x;
            const dy1 = currPoint.y - prevPoint.y;
            const dx2 = nextPoint.x - currPoint.x;
            const dy2 = nextPoint.y - currPoint.y;
            const len1 = Math.hypot(dx1, dy1);
            const len2 = Math.hypot(dx2, dy2);
            if (len1 < epsilon || len2 < epsilon) {
                path += `L${currPoint.x},${currPoint.y}`;
                continue;
            }
            const nx1 = dx1 / len1;
            const ny1 = dy1 / len1;
            const nx2 = dx2 / len2;
            const ny2 = dy2 / len2;
            const dot = nx1 * nx2 + ny1 * ny2;
            const clampedDot = Math.max(-1, Math.min(1, dot));
            const angle = Math.acos(clampedDot);
            if (angle < epsilon || Math.abs(Math.PI - angle) < epsilon) {
                path += `L${currPoint.x},${currPoint.y}`;
                continue;
            }
            const cutLen = Math.min(radius / Math.sin(angle / 2), len1 / 2, len2 / 2);
            const startX = currPoint.x - nx1 * cutLen;
            const startY = currPoint.y - ny1 * cutLen;
            const endX = currPoint.x + nx2 * cutLen;
            const endY = currPoint.y + ny2 * cutLen;
            path += `L${startX},${startY}`;
            path += `Q${currPoint.x},${currPoint.y} ${endX},${endY}`;
        }
    }
    return path;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(generateRoundedPath, "generateRoundedPath");
function calculateDeltaAndAngle2(point1, point2) {
    if (!point1 || !point2) {
        return {
            angle: 0,
            deltaX: 0,
            deltaY: 0
        };
    }
    const deltaX = point2.x - point1.x;
    const deltaY = point2.y - point1.y;
    const angle = Math.atan2(deltaY, deltaX);
    return {
        angle,
        deltaX,
        deltaY
    };
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(calculateDeltaAndAngle2, "calculateDeltaAndAngle");
function applyMarkerOffsetsToPoints(points, edge) {
    const newPoints = points.map((point2)=>({
            ...point2
        }));
    if (points.length >= 2 && markerOffsets[edge.arrowTypeStart]) {
        const offsetValue = markerOffsets[edge.arrowTypeStart];
        const point1 = points[0];
        const point2 = points[1];
        const { angle } = calculateDeltaAndAngle2(point1, point2);
        const offsetX = offsetValue * Math.cos(angle);
        const offsetY = offsetValue * Math.sin(angle);
        newPoints[0].x = point1.x + offsetX;
        newPoints[0].y = point1.y + offsetY;
    }
    const n = points.length;
    if (n >= 2 && markerOffsets[edge.arrowTypeEnd]) {
        const offsetValue = markerOffsets[edge.arrowTypeEnd];
        const point1 = points[n - 1];
        const point2 = points[n - 2];
        const { angle } = calculateDeltaAndAngle2(point2, point1);
        const offsetX = offsetValue * Math.cos(angle);
        const offsetY = offsetValue * Math.sin(angle);
        newPoints[n - 1].x = point1.x - offsetX;
        newPoints[n - 1].y = point1.y - offsetY;
    }
    return newPoints;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(applyMarkerOffsetsToPoints, "applyMarkerOffsetsToPoints");
// src/rendering-util/rendering-elements/markers.js
var insertMarkers = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((elem, markerArray, type, id)=>{
    markerArray.forEach((markerName)=>{
        markers[markerName](elem, type, id);
    });
}, "insertMarkers");
var extension = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((elem, type, id)=>{
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].trace("Making markers for ", id);
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-extensionStart").attr("class", "marker extension " + type).attr("refX", 18).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 1,7 L18,13 V 1 Z");
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-extensionEnd").attr("class", "marker extension " + type).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 1,1 V 13 L18,7 Z");
    elem.append("marker").attr("id", id + "_" + type + "-extensionStart-margin").attr("class", "marker extension " + type).attr("refX", 18).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").attr("viewBox", "0 0 20 14").append("polygon").attr("points", "10,7 18,13 18,1").style("stroke-width", 2).style("stroke-dasharray", "0");
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-extensionEnd-margin").attr("class", "marker extension " + type).attr("refX", 9).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").attr("viewBox", "0 0 20 14").append("polygon").attr("points", "10,1 10,13 18,7").style("stroke-width", 2).style("stroke-dasharray", "0");
}, "extension");
var composition = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((elem, type, id)=>{
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-compositionStart").attr("class", "marker composition " + type).attr("refX", 18).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-compositionEnd").attr("class", "marker composition " + type).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-compositionStart-margin").attr("class", "marker composition " + type).attr("refX", 15).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 0).attr("viewBox", "0 0 15 15").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-compositionEnd-margin").attr("class", "marker composition " + type).attr("refX", 3.5).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 0).attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
}, "composition");
var aggregation = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((elem, type, id)=>{
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-aggregationStart").attr("class", "marker aggregation " + type).attr("refX", 18).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-aggregationEnd").attr("class", "marker aggregation " + type).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-aggregationStart-margin").attr("class", "marker aggregation " + type).attr("refX", 15).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 2).attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-aggregationEnd-margin").attr("class", "marker aggregation " + type).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 2).attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
}, "aggregation");
var dependency = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((elem, type, id)=>{
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-dependencyStart").attr("class", "marker dependency " + type).attr("refX", 6).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 5,7 L9,13 L1,7 L9,1 Z");
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-dependencyEnd").attr("class", "marker dependency " + type).attr("refX", 13).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 18,7 L9,13 L14,7 L9,1 Z");
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-dependencyStart-margin").attr("class", "marker dependency " + type).attr("refX", 4).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 0).attr("d", "M 5,7 L9,13 L1,7 L9,1 Z");
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-dependencyEnd-margin").attr("class", "marker dependency " + type).attr("refX", 16).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 0).attr("d", "M 18,7 L9,13 L14,7 L9,1 Z");
}, "dependency");
var lollipop = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((elem, type, id)=>{
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-lollipopStart").attr("class", "marker lollipop " + type).attr("refX", 13).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("circle").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6);
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-lollipopEnd").attr("class", "marker lollipop " + type).attr("refX", 1).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("circle").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6);
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-lollipopStart-margin").attr("class", "marker lollipop " + type).attr("refX", 13).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("circle").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6).attr("stroke-width", 2);
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-lollipopEnd-margin").attr("class", "marker lollipop " + type).attr("refX", 1).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("circle").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6).attr("stroke-width", 2);
}, "lollipop");
var point = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((elem, type, id)=>{
    elem.append("marker").attr("id", id + "_" + type + "-pointEnd").attr("class", "marker " + type).attr("viewBox", "0 0 10 10").attr("refX", 5).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 8).attr("markerHeight", 8).attr("orient", "auto").append("path").attr("d", "M 0 0 L 10 5 L 0 10 z").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0");
    elem.append("marker").attr("id", id + "_" + type + "-pointStart").attr("class", "marker " + type).attr("viewBox", "0 0 10 10").attr("refX", 4.5).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 8).attr("markerHeight", 8).attr("orient", "auto").append("path").attr("d", "M 0 5 L 10 10 L 10 0 z").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0");
    elem.append("marker").attr("id", id + "_" + type + "-pointEnd-margin").attr("class", "marker " + type).attr("viewBox", "0 0 11.5 14").attr("refX", 11.5).attr("refY", 7).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 10.5).attr("markerHeight", 14).attr("orient", "auto").append("path").attr("d", "M 0 0 L 11.5 7 L 0 14 z").attr("class", "arrowMarkerPath").style("stroke-width", 0).style("stroke-dasharray", "1,0");
    elem.append("marker").attr("id", id + "_" + type + "-pointStart-margin").attr("class", "marker " + type).attr("viewBox", "0 0 11.5 14").attr("refX", 1).attr("refY", 7).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11.5).attr("markerHeight", 14).attr("orient", "auto").append("polygon").attr("points", "0,7 11.5,14 11.5,0").attr("class", "arrowMarkerPath").style("stroke-width", 0).style("stroke-dasharray", "1,0");
}, "point");
var circle = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((elem, type, id)=>{
    elem.append("marker").attr("id", id + "_" + type + "-circleEnd").attr("class", "marker " + type).attr("viewBox", "0 0 10 10").attr("refX", 11).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0");
    elem.append("marker").attr("id", id + "_" + type + "-circleStart").attr("class", "marker " + type).attr("viewBox", "0 0 10 10").attr("refX", -1).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0");
    elem.append("marker").attr("id", id + "_" + type + "-circleEnd-margin").attr("class", "marker " + type).attr("viewBox", "0 0 10 10").attr("refY", 5).attr("refX", 12.25).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 14).attr("markerHeight", 14).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 0).style("stroke-dasharray", "1,0");
    elem.append("marker").attr("id", id + "_" + type + "-circleStart-margin").attr("class", "marker " + type).attr("viewBox", "0 0 10 10").attr("refX", -2).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 14).attr("markerHeight", 14).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 0).style("stroke-dasharray", "1,0");
}, "circle");
var cross = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((elem, type, id)=>{
    elem.append("marker").attr("id", id + "_" + type + "-crossEnd").attr("class", "marker cross " + type).attr("viewBox", "0 0 11 11").attr("refX", 12).attr("refY", 5.2).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("path").attr("d", "M 1,1 l 9,9 M 10,1 l -9,9").attr("class", "arrowMarkerPath").style("stroke-width", 2).style("stroke-dasharray", "1,0");
    elem.append("marker").attr("id", id + "_" + type + "-crossStart").attr("class", "marker cross " + type).attr("viewBox", "0 0 11 11").attr("refX", -1).attr("refY", 5.2).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("path").attr("d", "M 1,1 l 9,9 M 10,1 l -9,9").attr("class", "arrowMarkerPath").style("stroke-width", 2).style("stroke-dasharray", "1,0");
    elem.append("marker").attr("id", id + "_" + type + "-crossEnd-margin").attr("class", "marker cross " + type).attr("viewBox", "0 0 15 15").attr("refX", 17.7).attr("refY", 7.5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 12).attr("markerHeight", 12).attr("orient", "auto").append("path").attr("d", "M 1,1 L 14,14 M 1,14 L 14,1").attr("class", "arrowMarkerPath").style("stroke-width", 2.5);
    elem.append("marker").attr("id", id + "_" + type + "-crossStart-margin").attr("class", "marker cross " + type).attr("viewBox", "0 0 15 15").attr("refX", -3.5).attr("refY", 7.5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 12).attr("markerHeight", 12).attr("orient", "auto").append("path").attr("d", "M 1,1 L 14,14 M 1,14 L 14,1").attr("class", "arrowMarkerPath").style("stroke-width", 2.5).style("stroke-dasharray", "1,0");
}, "cross");
var barb = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((elem, type, id)=>{
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-barbEnd").attr("refX", 19).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 14).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto").append("path").attr("d", "M 19,7 L9,13 L14,7 L9,1 Z");
}, "barb");
var barbNeo = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((elem, type, id)=>{
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig"])();
    const { themeVariables } = config;
    const { transitionColor } = themeVariables;
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-barbEnd").attr("refX", 19).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 14).attr("markerUnits", "strokeWidth").attr("orient", "auto").append("path").attr("d", "M 19,7 L11,14 L13,7 L11,0 Z");
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-barbEnd-margin").attr("refX", 17).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 14).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto").append("path").attr("d", "M 19,7 L11,14 L13,7 L11,0 Z").attr("fill", `${transitionColor}`);
}, "barbNeo");
var only_one = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((elem, type, id)=>{
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-onlyOneStart").attr("class", "marker onlyOne " + type).attr("refX", 0).attr("refY", 9).attr("markerWidth", 18).attr("markerHeight", 18).attr("orient", "auto").append("path").attr("d", "M9,0 L9,18 M15,0 L15,18");
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-onlyOneEnd").attr("class", "marker onlyOne " + type).attr("refX", 18).attr("refY", 9).attr("markerWidth", 18).attr("markerHeight", 18).attr("orient", "auto").append("path").attr("d", "M3,0 L3,18 M9,0 L9,18");
}, "only_one");
var zero_or_one = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((elem, type, id)=>{
    const startMarker = elem.append("defs").append("marker").attr("id", id + "_" + type + "-zeroOrOneStart").attr("class", "marker zeroOrOne " + type).attr("refX", 0).attr("refY", 9).attr("markerWidth", 30).attr("markerHeight", 18).attr("orient", "auto");
    startMarker.append("circle").attr("fill", "white").attr("cx", 21).attr("cy", 9).attr("r", 6);
    startMarker.append("path").attr("d", "M9,0 L9,18");
    const endMarker = elem.append("defs").append("marker").attr("id", id + "_" + type + "-zeroOrOneEnd").attr("class", "marker zeroOrOne " + type).attr("refX", 30).attr("refY", 9).attr("markerWidth", 30).attr("markerHeight", 18).attr("orient", "auto");
    endMarker.append("circle").attr("fill", "white").attr("cx", 9).attr("cy", 9).attr("r", 6);
    endMarker.append("path").attr("d", "M21,0 L21,18");
}, "zero_or_one");
var one_or_more = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((elem, type, id)=>{
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-oneOrMoreStart").attr("class", "marker oneOrMore " + type).attr("refX", 18).attr("refY", 18).attr("markerWidth", 45).attr("markerHeight", 36).attr("orient", "auto").append("path").attr("d", "M0,18 Q 18,0 36,18 Q 18,36 0,18 M42,9 L42,27");
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-oneOrMoreEnd").attr("class", "marker oneOrMore " + type).attr("refX", 27).attr("refY", 18).attr("markerWidth", 45).attr("markerHeight", 36).attr("orient", "auto").append("path").attr("d", "M3,9 L3,27 M9,18 Q27,0 45,18 Q27,36 9,18");
}, "one_or_more");
var zero_or_more = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((elem, type, id)=>{
    const startMarker = elem.append("defs").append("marker").attr("id", id + "_" + type + "-zeroOrMoreStart").attr("class", "marker zeroOrMore " + type).attr("refX", 18).attr("refY", 18).attr("markerWidth", 57).attr("markerHeight", 36).attr("orient", "auto");
    startMarker.append("circle").attr("fill", "white").attr("cx", 48).attr("cy", 18).attr("r", 6);
    startMarker.append("path").attr("d", "M0,18 Q18,0 36,18 Q18,36 0,18");
    const endMarker = elem.append("defs").append("marker").attr("id", id + "_" + type + "-zeroOrMoreEnd").attr("class", "marker zeroOrMore " + type).attr("refX", 39).attr("refY", 18).attr("markerWidth", 57).attr("markerHeight", 36).attr("orient", "auto");
    endMarker.append("circle").attr("fill", "white").attr("cx", 9).attr("cy", 18).attr("r", 6);
    endMarker.append("path").attr("d", "M21,18 Q39,0 57,18 Q39,36 21,18");
}, "zero_or_more");
var only_one_neo = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((elem, type, id)=>{
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig"])();
    const { themeVariables } = config;
    const { strokeWidth } = themeVariables;
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-onlyOneStart").attr("class", "marker onlyOne " + type).attr("refX", 0).attr("refY", 9).attr("markerWidth", 18).attr("markerHeight", 18).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M9,0 L9,18 M15,0 L15,18").attr("stroke-width", `${strokeWidth}`);
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-onlyOneEnd").attr("class", "marker onlyOne " + type).attr("refX", 18).attr("refY", 9).attr("markerWidth", 18).attr("markerHeight", 18).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M3,0 L3,18 M9,0 L9,18").attr("stroke-width", `${strokeWidth}`);
}, "only_one_neo");
var zero_or_one_neo = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((elem, type, id)=>{
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig"])();
    const { themeVariables } = config;
    const { strokeWidth, mainBkg } = themeVariables;
    const startMarker = elem.append("defs").append("marker").attr("id", id + "_" + type + "-zeroOrOneStart").attr("class", "marker zeroOrOne " + type).attr("refX", 0).attr("refY", 9).attr("markerWidth", 30).attr("markerHeight", 18).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse");
    startMarker.append("circle").attr("fill", mainBkg ?? "white").attr("cx", 21).attr("cy", 9).attr("stroke-width", `${strokeWidth}`).attr("r", 6);
    startMarker.append("path").attr("d", "M9,0 L9,18").attr("stroke-width", `${strokeWidth}`);
    const endMarker = elem.append("defs").append("marker").attr("id", id + "_" + type + "-zeroOrOneEnd").attr("class", "marker zeroOrOne " + type).attr("refX", 30).attr("refY", 9).attr("markerWidth", 30).attr("markerHeight", 18).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto");
    endMarker.append("circle").attr("fill", mainBkg ?? "white").attr("cx", 9).attr("cy", 9).attr("stroke-width", `${strokeWidth}`).attr("r", 6);
    endMarker.append("path").attr("d", "M21,0 L21,18").attr("stroke-width", `${strokeWidth}`);
}, "zero_or_one_neo");
var one_or_more_neo = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((elem, type, id)=>{
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig"])();
    const { themeVariables } = config;
    const { strokeWidth } = themeVariables;
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-oneOrMoreStart").attr("class", "marker oneOrMore " + type).attr("refX", 18).attr("refY", 18).attr("markerWidth", 45).attr("markerHeight", 36).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M0,18 Q 18,0 36,18 Q 18,36 0,18 M42,9 L42,27").attr("stroke-width", `${strokeWidth}`);
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-oneOrMoreEnd").attr("class", "marker oneOrMore " + type).attr("refX", 27).attr("refY", 18).attr("markerWidth", 45).attr("markerHeight", 36).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto").append("path").attr("d", "M3,9 L3,27 M9,18 Q27,0 45,18 Q27,36 9,18").attr("stroke-width", `${strokeWidth}`);
}, "one_or_more_neo");
var zero_or_more_neo = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((elem, type, id)=>{
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig"])();
    const { themeVariables } = config;
    const { strokeWidth, mainBkg } = themeVariables;
    const startMarker = elem.append("defs").append("marker").attr("id", id + "_" + type + "-zeroOrMoreStart").attr("class", "marker zeroOrMore " + type).attr("refX", 18).attr("refY", 18).attr("markerWidth", 57).attr("markerHeight", 36).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto");
    startMarker.append("circle").attr("fill", mainBkg ?? "white").attr("cx", 45.5).attr("cy", 18).attr("r", 6).attr("stroke-width", `${strokeWidth}`);
    startMarker.append("path").attr("d", "M0,18 Q18,0 36,18 Q18,36 0,18").attr("stroke-width", `${strokeWidth}`);
    const endMarker = elem.append("defs").append("marker").attr("id", id + "_" + type + "-zeroOrMoreEnd").attr("class", "marker zeroOrMore " + type).attr("refX", 39).attr("refY", 18).attr("markerWidth", 57).attr("markerHeight", 36).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse");
    endMarker.append("circle").attr("fill", mainBkg ?? "white").attr("cx", 11).attr("cy", 18).attr("r", 6).attr("stroke-width", `${strokeWidth}`);
    endMarker.append("path").attr("d", "M21,18 Q39,0 57,18 Q39,36 21,18").attr("stroke-width", `${strokeWidth}`);
}, "zero_or_more_neo");
var requirement_arrow = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((elem, type, id)=>{
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-requirement_arrowEnd").attr("refX", 20).attr("refY", 10).attr("markerWidth", 20).attr("markerHeight", 20).attr("orient", "auto").append("path").attr("d", `M0,0
      L20,10
      M20,10
      L0,20`);
}, "requirement_arrow");
var requirement_arrow_neo = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((elem, type, id)=>{
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig"])();
    const { themeVariables } = config;
    const { strokeWidth } = themeVariables;
    elem.append("defs").append("marker").attr("id", id + "_" + type + "-requirement_arrowEnd").attr("refX", 20).attr("refY", 10).attr("markerWidth", 20).attr("markerHeight", 20).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").attr("stroke-width", `${strokeWidth}`).attr("viewBox", "0 0 25 20").append("path").attr("d", `M0,0
      L20,10
      M20,10
      L0,20`).attr("stroke-linejoin", "miter");
}, "requirement_arrow_neo");
var requirement_contains = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((elem, type, id)=>{
    const containsNode = elem.append("defs").append("marker").attr("id", id + "_" + type + "-requirement_containsStart").attr("refX", 0).attr("refY", 10).attr("markerWidth", 20).attr("markerHeight", 20).attr("orient", "auto").append("g");
    containsNode.append("circle").attr("cx", 10).attr("cy", 10).attr("r", 9).attr("fill", "none");
    containsNode.append("line").attr("x1", 1).attr("x2", 19).attr("y1", 10).attr("y2", 10);
    containsNode.append("line").attr("y1", 1).attr("y2", 19).attr("x1", 10).attr("x2", 10);
}, "requirement_contains");
var requirement_contains_neo = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((elem, type, id)=>{
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig"])();
    const { themeVariables } = config;
    const { strokeWidth } = themeVariables;
    const containsNode = elem.append("defs").append("marker").attr("id", id + "_" + type + "-requirement_containsStart").attr("refX", 0).attr("refY", 10).attr("markerWidth", 20).attr("markerHeight", 20).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("g");
    containsNode.append("circle").attr("cx", 10).attr("cy", 10).attr("r", 9).attr("fill", "none");
    containsNode.append("line").attr("x1", 1).attr("x2", 19).attr("y1", 10).attr("y2", 10);
    containsNode.append("line").attr("y1", 1).attr("y2", 19).attr("x1", 10).attr("x2", 10);
    containsNode.selectAll("*").attr("stroke-width", `${strokeWidth}`);
}, "requirement_contains_neo");
var markers = {
    extension,
    composition,
    aggregation,
    dependency,
    lollipop,
    point,
    circle,
    cross,
    barb,
    barbNeo,
    only_one,
    zero_or_one,
    one_or_more,
    zero_or_more,
    only_one_neo,
    zero_or_one_neo,
    one_or_more_neo,
    zero_or_more_neo,
    requirement_arrow,
    requirement_contains,
    requirement_arrow_neo,
    requirement_contains_neo
};
var markers_default = insertMarkers;
;
}),
"[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-P2QGCYS3.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "compileStyles",
    ()=>compileStyles,
    "isLabelStyle",
    ()=>isLabelStyle,
    "solidStateFill",
    ()=>solidStateFill,
    "styles2String",
    ()=>styles2String,
    "userNodeOverrides",
    ()=>userNodeOverrides
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-DU6HZSFF.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-Y2CYZVJY.mjs [app-client] (ecmascript)");
;
;
// src/rendering-util/rendering-elements/shapes/handDrawnShapeStyles.ts
var solidStateFill = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((color)=>{
    const { handDrawnSeed } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig2"])();
    return {
        fill: color,
        hachureAngle: 120,
        // angle of hachure,
        hachureGap: 4,
        fillWeight: 2,
        roughness: 0.7,
        stroke: color,
        seed: handDrawnSeed
    };
}, "solidStateFill");
var normalizeStyleList = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((styles)=>{
    if (Array.isArray(styles)) {
        return styles;
    }
    if (!styles) {
        return [];
    }
    return styles.split(";").map((style)=>style.trim()).filter(Boolean);
}, "normalizeStyleList");
var compileStyles = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((node)=>{
    const stylesMap = styles2Map([
        ...node.cssCompiledStyles || [],
        ...node.cssStyles || [],
        ...normalizeStyleList(node.labelStyle)
    ]);
    return {
        stylesMap,
        stylesArray: [
            ...stylesMap
        ]
    };
}, "compileStyles");
var styles2Map = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((styles)=>{
    const styleMap = /* @__PURE__ */ new Map();
    styles.forEach((style)=>{
        const [key, value] = style.split(":");
        styleMap.set(key.trim(), value?.trim());
    });
    return styleMap;
}, "styles2Map");
var isLabelStyle = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((key)=>{
    return key === "color" || key === "font-size" || key === "font-family" || key === "font-weight" || key === "font-style" || key === "text-decoration" || key === "text-align" || key === "text-transform" || key === "line-height" || key === "letter-spacing" || key === "word-spacing" || key === "text-shadow" || key === "text-overflow" || key === "white-space" || key === "word-wrap" || key === "word-break" || key === "overflow-wrap" || key === "hyphens";
}, "isLabelStyle");
var styles2String = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((node)=>{
    const { stylesArray } = compileStyles(node);
    const labelStyles = [];
    const nodeStyles = [];
    const borderStyles = [];
    const backgroundStyles = [];
    stylesArray.forEach((style)=>{
        const key = style[0];
        if (isLabelStyle(key)) {
            labelStyles.push(style.join(":") + " !important");
        } else {
            nodeStyles.push(style.join(":") + " !important");
            if (key.includes("stroke")) {
                borderStyles.push(style.join(":") + " !important");
            }
            if (key === "fill") {
                backgroundStyles.push(style.join(":") + " !important");
            }
        }
    });
    return {
        labelStyles: labelStyles.join(";"),
        nodeStyles: nodeStyles.join(";"),
        stylesArray,
        borderStyles,
        backgroundStyles
    };
}, "styles2String");
var userNodeOverrides = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((node, options)=>{
    const { themeVariables, handDrawnSeed } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig2"])();
    const { nodeBorder, mainBkg } = themeVariables;
    const { stylesMap } = compileStyles(node);
    const result = Object.assign({
        roughness: 0.7,
        fill: stylesMap.get("fill") || mainBkg,
        fillStyle: "hachure",
        // solid fill
        fillWeight: 4,
        hachureGap: 5.2,
        stroke: stylesMap.get("stroke") || nodeBorder,
        seed: handDrawnSeed,
        strokeWidth: stylesMap.get("stroke-width")?.replace("px", "") || 1.3,
        fillLineDash: [
            0,
            0
        ],
        strokeLineDash: getStrokeDashArray(stylesMap.get("stroke-dasharray"))
    }, options);
    return result;
}, "userNodeOverrides");
var getStrokeDashArray = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((strokeDasharrayStyle)=>{
    if (!strokeDasharrayStyle) {
        return [
            0,
            0
        ];
    }
    const dashArray = strokeDasharrayStyle.trim().split(/\s+/).map(Number);
    if (dashArray.length === 1) {
        const val = isNaN(dashArray[0]) ? 0 : dashArray[0];
        return [
            val,
            val
        ];
    }
    const first = isNaN(dashArray[0]) ? 0 : dashArray[0];
    const second = isNaN(dashArray[1]) ? 0 : dashArray[1];
    return [
        first,
        second
    ];
}, "getStrokeDashArray");
;
}),
"[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-PWAF6VOD.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getIconSVG",
    ()=>getIconSVG,
    "isIconAvailable",
    ()=>isIconAvailable,
    "registerIconPacks",
    ()=>registerIconPacks,
    "unknownIcon",
    ()=>unknownIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-DU6HZSFF.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-X3CZISLH.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-Y2CYZVJY.mjs [app-client] (ecmascript)");
// src/rendering-util/icons.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$iconify$2f$utils$2f$lib$2f$icon$2d$set$2f$get$2d$icon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@iconify/utils/lib/icon-set/get-icon.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$iconify$2f$utils$2f$lib$2f$svg$2f$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@iconify/utils/lib/svg/html.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$iconify$2f$utils$2f$lib$2f$svg$2f$build$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@iconify/utils/lib/svg/build.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$iconify$2f$utils$2f$lib$2f$svg$2f$id$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@iconify/utils/lib/svg/id.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$iconify$2f$utils$2f$lib$2f$icon$2f$name$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@iconify/utils/lib/icon/name.js [app-client] (ecmascript)");
;
;
;
;
var unknownIcon = {
    body: '<g><rect width="80" height="80" style="fill: #087ebf; stroke-width: 0px;"/><text transform="translate(21.16 64.67)" style="fill: #fff; font-family: ArialMT, Arial; font-size: 67.75px;"><tspan x="0" y="0">?</tspan></text></g>',
    height: 80,
    width: 80
};
var iconsStore = /* @__PURE__ */ new Map();
var loaderStore = /* @__PURE__ */ new Map();
var registerIconPacks = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((iconLoaders)=>{
    for (const iconLoader of iconLoaders){
        if (!iconLoader.name) {
            throw new Error('Invalid icon loader. Must have a "name" property with non-empty string value.');
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Registering icon pack:", iconLoader.name);
        if ("loader" in iconLoader) {
            loaderStore.set(iconLoader.name, iconLoader.loader);
        } else if ("icons" in iconLoader) {
            iconsStore.set(iconLoader.name, iconLoader.icons);
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].error("Invalid icon loader:", iconLoader);
            throw new Error('Invalid icon loader. Must have either "icons" or "loader" property.');
        }
    }
}, "registerIconPacks");
var getRegisteredIconData = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(async (iconName, fallbackPrefix)=>{
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$iconify$2f$utils$2f$lib$2f$icon$2f$name$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringToIcon"])(iconName, true, fallbackPrefix !== void 0);
    if (!data) {
        throw new Error(`Invalid icon name: ${iconName}`);
    }
    const prefix = data.prefix || fallbackPrefix;
    if (!prefix) {
        throw new Error(`Icon name must contain a prefix: ${iconName}`);
    }
    let icons = iconsStore.get(prefix);
    if (!icons) {
        const loader = loaderStore.get(prefix);
        if (!loader) {
            throw new Error(`Icon set not found: ${data.prefix}`);
        }
        try {
            const loaded = await loader();
            icons = {
                ...loaded,
                prefix
            };
            iconsStore.set(prefix, icons);
        } catch (e) {
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].error(e);
            throw new Error(`Failed to load icon set: ${data.prefix}`);
        }
    }
    const iconData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$iconify$2f$utils$2f$lib$2f$icon$2d$set$2f$get$2d$icon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getIconData"])(icons, data.name);
    if (!iconData) {
        throw new Error(`Icon not found: ${iconName}`);
    }
    return iconData;
}, "getRegisteredIconData");
var isIconAvailable = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(async (iconName)=>{
    try {
        await getRegisteredIconData(iconName);
        return true;
    } catch  {
        return false;
    }
}, "isIconAvailable");
var getIconSVG = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(async (iconName, customisations, extraAttributes)=>{
    let iconData;
    try {
        iconData = await getRegisteredIconData(iconName, customisations?.fallbackPrefix);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].error(e);
        iconData = unknownIcon;
    }
    const renderData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$iconify$2f$utils$2f$lib$2f$svg$2f$build$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["iconToSVG"])(iconData, customisations);
    const svg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$iconify$2f$utils$2f$lib$2f$svg$2f$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["iconToHTML"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$iconify$2f$utils$2f$lib$2f$svg$2f$id$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["replaceIDs"])(renderData.body), {
        ...renderData.attributes,
        ...extraAttributes
    });
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeText"])(svg, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig"])());
}, "getIconSVG");
;
}),
"[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-TLUHSLCS.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getRegisteredLayoutAlgorithm",
    ()=>getRegisteredLayoutAlgorithm,
    "registerLayoutLoaders",
    ()=>registerLayoutLoaders,
    "render",
    ()=>render
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$L3NEJ4N5$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-L3NEJ4N5.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$OSK3NFVY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-OSK3NFVY.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$GVQU2GXP$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-GVQU2GXP.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$4HAMMTFA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-4HAMMTFA.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$75Z2AOVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-75Z2AOVW.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-DU6HZSFF.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-X3CZISLH.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-Y2CYZVJY.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
// src/internals.ts
var internalHelpers = {
    common: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["common_default"],
    getConfig: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$DU6HZSFF$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConfig"],
    insertCluster: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$L3NEJ4N5$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["insertCluster"],
    insertEdge: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$OSK3NFVY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["insertEdge"],
    insertEdgeLabel: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$OSK3NFVY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["insertEdgeLabel"],
    insertMarkers: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$OSK3NFVY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["markers_default"],
    insertNode: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$GVQU2GXP$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["insertNode"],
    interpolateToCurve: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$75Z2AOVW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["interpolateToCurve"],
    labelHelper: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$4HAMMTFA$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["labelHelper"],
    log: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"],
    positionEdgeLabel: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$OSK3NFVY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["positionEdgeLabel"]
};
// src/rendering-util/render.ts
var layoutAlgorithms = {};
var registerLayoutLoaders = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((loaders)=>{
    for (const loader of loaders){
        layoutAlgorithms[loader.name] = loader;
    }
}, "registerLayoutLoaders");
var registerDefaultLayoutLoaders = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(()=>{
    registerLayoutLoaders([
        {
            name: "dagre",
            loader: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(async ()=>await __turbopack_context__.A("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/dagre-GXQ25YYZ.mjs [app-client] (ecmascript, async loader)"), "loader")
        },
        {
            name: "swimlane",
            loader: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(async ()=>await __turbopack_context__.A("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/swimlanes-42K2YHIH.mjs [app-client] (ecmascript, async loader)"), "loader")
        },
        ...("TURBOPACK compile-time truthy", 1) ? [
            {
                name: "cose-bilkent",
                loader: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(async ()=>await __turbopack_context__.A("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/cose-bilkent-JH36ORCC.mjs [app-client] (ecmascript, async loader)"), "loader")
            }
        ] : "TURBOPACK unreachable"
    ]);
}, "registerDefaultLayoutLoaders");
registerDefaultLayoutLoaders();
var render = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(async (data4Layout, svg)=>{
    if (!(data4Layout.layoutAlgorithm in layoutAlgorithms)) {
        throw new Error(`Unknown layout algorithm: ${data4Layout.layoutAlgorithm}`);
    }
    if (data4Layout.diagramId) {
        for (const node of data4Layout.nodes){
            const originalDomId = node.domId || node.id;
            node.domId = `${data4Layout.diagramId}-${originalDomId}`;
        }
    }
    const layoutDefinition = layoutAlgorithms[data4Layout.layoutAlgorithm];
    const layoutRenderer = await layoutDefinition.loader();
    const { theme, themeVariables } = data4Layout.config;
    const { useGradient, gradientStart, gradientStop } = themeVariables;
    const svgId = svg.attr("id");
    svg.append("defs").append("filter").attr("id", `${svgId}-drop-shadow`).attr("height", "130%").attr("width", "130%").append("feDropShadow").attr("dx", "4").attr("dy", "4").attr("stdDeviation", 0).attr("flood-opacity", "0.06").attr("flood-color", `${theme?.includes("dark") ? "#FFFFFF" : "#000000"}`);
    svg.append("defs").append("filter").attr("id", `${svgId}-drop-shadow-small`).attr("height", "150%").attr("width", "150%").append("feDropShadow").attr("dx", "2").attr("dy", "2").attr("stdDeviation", 0).attr("flood-opacity", "0.06").attr("flood-color", `${theme?.includes("dark") ? "#FFFFFF" : "#000000"}`);
    if (useGradient) {
        const gradient = svg.append("linearGradient").attr("id", svg.attr("id") + "-gradient").attr("gradientUnits", "objectBoundingBox").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%");
        gradient.append("svg:stop").attr("offset", "0%").attr("stop-color", gradientStart).attr("stop-opacity", 1);
        gradient.append("svg:stop").attr("offset", "100%").attr("stop-color", gradientStop).attr("stop-opacity", 1);
    }
    return layoutRenderer.render(data4Layout, svg, internalHelpers, {
        algorithm: layoutDefinition.algorithm
    });
}, "render");
var getRegisteredLayoutAlgorithm = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((algorithm = "", { fallback = "dagre" } = {})=>{
    if (algorithm in layoutAlgorithms) {
        return algorithm;
    }
    if (fallback in layoutAlgorithms) {
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].warn(`Layout algorithm ${algorithm} is not registered. Using ${fallback} as fallback.`);
        return fallback;
    }
    throw new Error(`Both layout algorithms ${algorithm} and ${fallback} are not registered.`);
}, "getRegisteredLayoutAlgorithm");
;
}),
"[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-X3CZISLH.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "log",
    ()=>log,
    "setLogLevel",
    ()=>setLogLevel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-Y2CYZVJY.mjs [app-client] (ecmascript)");
// src/logger.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/dayjs/dayjs.min.js [app-client] (ecmascript)");
;
;
var LEVELS = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    fatal: 5
};
var log = {
    trace: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((..._args)=>{}, "trace"),
    debug: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((..._args)=>{}, "debug"),
    info: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((..._args)=>{}, "info"),
    warn: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((..._args)=>{}, "warn"),
    error: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((..._args)=>{}, "error"),
    fatal: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((..._args)=>{}, "fatal")
};
var setLogLevel = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(function(level = "fatal") {
    let numericLevel = LEVELS.fatal;
    if (typeof level === "string") {
        if (level.toLowerCase() in LEVELS) {
            numericLevel = LEVELS[level];
        }
    } else if (typeof level === "number") {
        numericLevel = level;
    }
    log.trace = ()=>{};
    log.debug = ()=>{};
    log.info = ()=>{};
    log.warn = ()=>{};
    log.error = ()=>{};
    log.fatal = ()=>{};
    if (numericLevel <= LEVELS.fatal) {
        log.fatal = console.error ? console.error.bind(console, format("FATAL"), "color: orange") : console.log.bind(console, "\x1B[35m", format("FATAL"));
    }
    if (numericLevel <= LEVELS.error) {
        log.error = console.error ? console.error.bind(console, format("ERROR"), "color: orange") : console.log.bind(console, "\x1B[31m", format("ERROR"));
    }
    if (numericLevel <= LEVELS.warn) {
        log.warn = console.warn ? console.warn.bind(console, format("WARN"), "color: orange") : console.log.bind(console, `\x1B[33m`, format("WARN"));
    }
    if (numericLevel <= LEVELS.info) {
        log.info = console.info ? console.info.bind(console, format("INFO"), "color: lightblue") : console.log.bind(console, "\x1B[34m", format("INFO"));
    }
    if (numericLevel <= LEVELS.debug) {
        log.debug = console.debug ? console.debug.bind(console, format("DEBUG"), "color: lightgreen") : console.log.bind(console, "\x1B[32m", format("DEBUG"));
    }
    if (numericLevel <= LEVELS.trace) {
        log.trace = console.debug ? console.debug.bind(console, format("TRACE"), "color: lightgreen") : console.log.bind(console, "\x1B[32m", format("TRACE"));
    }
}, "setLogLevel");
var format = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])((level)=>{
    const time = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$dayjs$2f$dayjs$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])().format("ss.SSS");
    return `%c${time} : ${level} : `;
}, "format");
;
}),
"[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-Y2CYZVJY.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__export",
    ()=>__export,
    "__name",
    ()=>__name
]);
var __defProp = Object.defineProperty;
var __name = (target, value)=>__defProp(target, "name", {
        value,
        configurable: true
    });
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
;
}),
]);

//# sourceMappingURL=19xk_mermaid_dist_chunks_mermaid_core_0f-kp4e._.js.map