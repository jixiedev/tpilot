(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/node_modules/cose-base/cose-base.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

(function webpackUniversalModuleDefinition(root, factory) {
    if ("TURBOPACK compile-time truthy", 1) module.exports = factory(__turbopack_context__.r("[project]/frontend/node_modules/layout-base/layout-base.js [app-client] (ecmascript)"));
    else //TURBOPACK unreachable
    ;
})(/*TURBOPACK member replacement*/ __turbopack_context__.e, function(__WEBPACK_EXTERNAL_MODULE_0__) {
    return /******/ function(modules) {
        /******/ // The module cache
        /******/ var installedModules = {};
        /******/ /******/ // The require function
        /******/ function __webpack_require__(moduleId) {
            /******/ /******/ // Check if module is in cache
            /******/ if (installedModules[moduleId]) {
                /******/ return installedModules[moduleId].exports;
            /******/ }
            /******/ // Create a new module (and put it into the cache)
            /******/ var module1 = installedModules[moduleId] = {
                /******/ i: moduleId,
                /******/ l: false,
                /******/ exports: {}
            };
            /******/ /******/ // Execute the module function
            /******/ modules[moduleId].call(module1.exports, module1, module1.exports, __webpack_require__);
            /******/ /******/ // Flag the module as loaded
            /******/ module1.l = true;
            /******/ /******/ // Return the exports of the module
            /******/ return module1.exports;
        /******/ }
        /******/ /******/ /******/ // expose the modules object (__webpack_modules__)
        /******/ __webpack_require__.m = modules;
        /******/ /******/ // expose the module cache
        /******/ __webpack_require__.c = installedModules;
        /******/ /******/ // identity function for calling harmony imports with the correct context
        /******/ __webpack_require__.i = function(value) {
            return value;
        };
        /******/ /******/ // define getter function for harmony exports
        /******/ __webpack_require__.d = function(exports, name, getter) {
            /******/ if (!__webpack_require__.o(exports, name)) {
                /******/ Object.defineProperty(exports, name, {
                    /******/ configurable: false,
                    /******/ enumerable: true,
                    /******/ get: getter
                });
            /******/ }
        /******/ };
        /******/ /******/ // getDefaultExport function for compatibility with non-harmony modules
        /******/ __webpack_require__.n = function(module1) {
            /******/ var getter = module1 && module1.__esModule ? /******/ function getDefault() {
                return module1['default'];
            } : /******/ function getModuleExports() {
                return module1;
            };
            /******/ __webpack_require__.d(getter, 'a', getter);
            /******/ return getter;
        /******/ };
        /******/ /******/ // Object.prototype.hasOwnProperty.call
        /******/ __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        };
        /******/ /******/ // __webpack_public_path__
        /******/ __webpack_require__.p = "";
        /******/ /******/ // Load entry module and return exports
        /******/ return __webpack_require__(__webpack_require__.s = 7);
    /******/ }([
        function(module1, exports) {
            module1.exports = __WEBPACK_EXTERNAL_MODULE_0__;
        /***/ },
        function(module1, exports, __webpack_require__) {
            "use strict";
            var FDLayoutConstants = __webpack_require__(0).FDLayoutConstants;
            function CoSEConstants() {}
            //CoSEConstants inherits static props in FDLayoutConstants
            for(var prop in FDLayoutConstants){
                CoSEConstants[prop] = FDLayoutConstants[prop];
            }
            CoSEConstants.DEFAULT_USE_MULTI_LEVEL_SCALING = false;
            CoSEConstants.DEFAULT_RADIAL_SEPARATION = FDLayoutConstants.DEFAULT_EDGE_LENGTH;
            CoSEConstants.DEFAULT_COMPONENT_SEPERATION = 60;
            CoSEConstants.TILE = true;
            CoSEConstants.TILING_PADDING_VERTICAL = 10;
            CoSEConstants.TILING_PADDING_HORIZONTAL = 10;
            CoSEConstants.TREE_REDUCTION_ON_INCREMENTAL = false; // make this true when cose is used incrementally as a part of other non-incremental layout
            module1.exports = CoSEConstants;
        /***/ },
        function(module1, exports, __webpack_require__) {
            "use strict";
            var FDLayoutEdge = __webpack_require__(0).FDLayoutEdge;
            function CoSEEdge(source, target, vEdge) {
                FDLayoutEdge.call(this, source, target, vEdge);
            }
            CoSEEdge.prototype = Object.create(FDLayoutEdge.prototype);
            for(var prop in FDLayoutEdge){
                CoSEEdge[prop] = FDLayoutEdge[prop];
            }
            module1.exports = CoSEEdge;
        /***/ },
        function(module1, exports, __webpack_require__) {
            "use strict";
            var LGraph = __webpack_require__(0).LGraph;
            function CoSEGraph(parent, graphMgr, vGraph) {
                LGraph.call(this, parent, graphMgr, vGraph);
            }
            CoSEGraph.prototype = Object.create(LGraph.prototype);
            for(var prop in LGraph){
                CoSEGraph[prop] = LGraph[prop];
            }
            module1.exports = CoSEGraph;
        /***/ },
        function(module1, exports, __webpack_require__) {
            "use strict";
            var LGraphManager = __webpack_require__(0).LGraphManager;
            function CoSEGraphManager(layout) {
                LGraphManager.call(this, layout);
            }
            CoSEGraphManager.prototype = Object.create(LGraphManager.prototype);
            for(var prop in LGraphManager){
                CoSEGraphManager[prop] = LGraphManager[prop];
            }
            module1.exports = CoSEGraphManager;
        /***/ },
        function(module1, exports, __webpack_require__) {
            "use strict";
            var FDLayoutNode = __webpack_require__(0).FDLayoutNode;
            var IMath = __webpack_require__(0).IMath;
            function CoSENode(gm, loc, size, vNode) {
                FDLayoutNode.call(this, gm, loc, size, vNode);
            }
            CoSENode.prototype = Object.create(FDLayoutNode.prototype);
            for(var prop in FDLayoutNode){
                CoSENode[prop] = FDLayoutNode[prop];
            }
            CoSENode.prototype.move = function() {
                var layout = this.graphManager.getLayout();
                this.displacementX = layout.coolingFactor * (this.springForceX + this.repulsionForceX + this.gravitationForceX) / this.noOfChildren;
                this.displacementY = layout.coolingFactor * (this.springForceY + this.repulsionForceY + this.gravitationForceY) / this.noOfChildren;
                if (Math.abs(this.displacementX) > layout.coolingFactor * layout.maxNodeDisplacement) {
                    this.displacementX = layout.coolingFactor * layout.maxNodeDisplacement * IMath.sign(this.displacementX);
                }
                if (Math.abs(this.displacementY) > layout.coolingFactor * layout.maxNodeDisplacement) {
                    this.displacementY = layout.coolingFactor * layout.maxNodeDisplacement * IMath.sign(this.displacementY);
                }
                // a simple node, just move it
                if (this.child == null) {
                    this.moveBy(this.displacementX, this.displacementY);
                } else if (this.child.getNodes().length == 0) {
                    this.moveBy(this.displacementX, this.displacementY);
                } else {
                    this.propogateDisplacementToChildren(this.displacementX, this.displacementY);
                }
                layout.totalDisplacement += Math.abs(this.displacementX) + Math.abs(this.displacementY);
                this.springForceX = 0;
                this.springForceY = 0;
                this.repulsionForceX = 0;
                this.repulsionForceY = 0;
                this.gravitationForceX = 0;
                this.gravitationForceY = 0;
                this.displacementX = 0;
                this.displacementY = 0;
            };
            CoSENode.prototype.propogateDisplacementToChildren = function(dX, dY) {
                var nodes = this.getChild().getNodes();
                var node;
                for(var i = 0; i < nodes.length; i++){
                    node = nodes[i];
                    if (node.getChild() == null) {
                        node.moveBy(dX, dY);
                        node.displacementX += dX;
                        node.displacementY += dY;
                    } else {
                        node.propogateDisplacementToChildren(dX, dY);
                    }
                }
            };
            CoSENode.prototype.setPred1 = function(pred11) {
                this.pred1 = pred11;
            };
            CoSENode.prototype.getPred1 = function() {
                return pred1;
            };
            CoSENode.prototype.getPred2 = function() {
                return pred2;
            };
            CoSENode.prototype.setNext = function(next1) {
                this.next = next1;
            };
            CoSENode.prototype.getNext = function() {
                return next;
            };
            CoSENode.prototype.setProcessed = function(processed1) {
                this.processed = processed1;
            };
            CoSENode.prototype.isProcessed = function() {
                return processed;
            };
            module1.exports = CoSENode;
        /***/ },
        function(module1, exports, __webpack_require__) {
            "use strict";
            var FDLayout = __webpack_require__(0).FDLayout;
            var CoSEGraphManager = __webpack_require__(4);
            var CoSEGraph = __webpack_require__(3);
            var CoSENode = __webpack_require__(5);
            var CoSEEdge = __webpack_require__(2);
            var CoSEConstants = __webpack_require__(1);
            var FDLayoutConstants = __webpack_require__(0).FDLayoutConstants;
            var LayoutConstants = __webpack_require__(0).LayoutConstants;
            var Point = __webpack_require__(0).Point;
            var PointD = __webpack_require__(0).PointD;
            var Layout = __webpack_require__(0).Layout;
            var Integer = __webpack_require__(0).Integer;
            var IGeometry = __webpack_require__(0).IGeometry;
            var LGraph = __webpack_require__(0).LGraph;
            var Transform = __webpack_require__(0).Transform;
            function CoSELayout() {
                FDLayout.call(this);
                this.toBeTiled = {}; // Memorize if a node is to be tiled or is tiled
            }
            CoSELayout.prototype = Object.create(FDLayout.prototype);
            for(var prop in FDLayout){
                CoSELayout[prop] = FDLayout[prop];
            }
            CoSELayout.prototype.newGraphManager = function() {
                var gm = new CoSEGraphManager(this);
                this.graphManager = gm;
                return gm;
            };
            CoSELayout.prototype.newGraph = function(vGraph) {
                return new CoSEGraph(null, this.graphManager, vGraph);
            };
            CoSELayout.prototype.newNode = function(vNode) {
                return new CoSENode(this.graphManager, vNode);
            };
            CoSELayout.prototype.newEdge = function(vEdge) {
                return new CoSEEdge(null, null, vEdge);
            };
            CoSELayout.prototype.initParameters = function() {
                FDLayout.prototype.initParameters.call(this, arguments);
                if (!this.isSubLayout) {
                    if (CoSEConstants.DEFAULT_EDGE_LENGTH < 10) {
                        this.idealEdgeLength = 10;
                    } else {
                        this.idealEdgeLength = CoSEConstants.DEFAULT_EDGE_LENGTH;
                    }
                    this.useSmartIdealEdgeLengthCalculation = CoSEConstants.DEFAULT_USE_SMART_IDEAL_EDGE_LENGTH_CALCULATION;
                    this.springConstant = FDLayoutConstants.DEFAULT_SPRING_STRENGTH;
                    this.repulsionConstant = FDLayoutConstants.DEFAULT_REPULSION_STRENGTH;
                    this.gravityConstant = FDLayoutConstants.DEFAULT_GRAVITY_STRENGTH;
                    this.compoundGravityConstant = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH;
                    this.gravityRangeFactor = FDLayoutConstants.DEFAULT_GRAVITY_RANGE_FACTOR;
                    this.compoundGravityRangeFactor = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR;
                    // variables for tree reduction support
                    this.prunedNodesAll = [];
                    this.growTreeIterations = 0;
                    this.afterGrowthIterations = 0;
                    this.isTreeGrowing = false;
                    this.isGrowthFinished = false;
                    // variables for cooling
                    this.coolingCycle = 0;
                    this.maxCoolingCycle = this.maxIterations / FDLayoutConstants.CONVERGENCE_CHECK_PERIOD;
                    this.finalTemperature = FDLayoutConstants.CONVERGENCE_CHECK_PERIOD / this.maxIterations;
                    this.coolingAdjuster = 1;
                }
            };
            CoSELayout.prototype.layout = function() {
                var createBendsAsNeeded = LayoutConstants.DEFAULT_CREATE_BENDS_AS_NEEDED;
                if (createBendsAsNeeded) {
                    this.createBendpoints();
                    this.graphManager.resetAllEdges();
                }
                this.level = 0;
                return this.classicLayout();
            };
            CoSELayout.prototype.classicLayout = function() {
                this.nodesWithGravity = this.calculateNodesToApplyGravitationTo();
                this.graphManager.setAllNodesToApplyGravitation(this.nodesWithGravity);
                this.calcNoOfChildrenForAllNodes();
                this.graphManager.calcLowestCommonAncestors();
                this.graphManager.calcInclusionTreeDepths();
                this.graphManager.getRoot().calcEstimatedSize();
                this.calcIdealEdgeLengths();
                if (!this.incremental) {
                    var forest = this.getFlatForest();
                    // The graph associated with this layout is flat and a forest
                    if (forest.length > 0) {
                        this.positionNodesRadially(forest);
                    } else {
                        // Reduce the trees when incremental mode is not enabled and graph is not a forest 
                        this.reduceTrees();
                        // Update nodes that gravity will be applied
                        this.graphManager.resetAllNodesToApplyGravitation();
                        var allNodes = new Set(this.getAllNodes());
                        var intersection = this.nodesWithGravity.filter(function(x) {
                            return allNodes.has(x);
                        });
                        this.graphManager.setAllNodesToApplyGravitation(intersection);
                        this.positionNodesRandomly();
                    }
                } else {
                    if (CoSEConstants.TREE_REDUCTION_ON_INCREMENTAL) {
                        // Reduce the trees in incremental mode if only this constant is set to true 
                        this.reduceTrees();
                        // Update nodes that gravity will be applied
                        this.graphManager.resetAllNodesToApplyGravitation();
                        var allNodes = new Set(this.getAllNodes());
                        var intersection = this.nodesWithGravity.filter(function(x) {
                            return allNodes.has(x);
                        });
                        this.graphManager.setAllNodesToApplyGravitation(intersection);
                    }
                }
                this.initSpringEmbedder();
                this.runSpringEmbedder();
                return true;
            };
            CoSELayout.prototype.tick = function() {
                this.totalIterations++;
                if (this.totalIterations === this.maxIterations && !this.isTreeGrowing && !this.isGrowthFinished) {
                    if (this.prunedNodesAll.length > 0) {
                        this.isTreeGrowing = true;
                    } else {
                        return true;
                    }
                }
                if (this.totalIterations % FDLayoutConstants.CONVERGENCE_CHECK_PERIOD == 0 && !this.isTreeGrowing && !this.isGrowthFinished) {
                    if (this.isConverged()) {
                        if (this.prunedNodesAll.length > 0) {
                            this.isTreeGrowing = true;
                        } else {
                            return true;
                        }
                    }
                    this.coolingCycle++;
                    if (this.layoutQuality == 0) {
                        // quality - "draft"
                        this.coolingAdjuster = this.coolingCycle;
                    } else if (this.layoutQuality == 1) {
                        // quality - "default"
                        this.coolingAdjuster = this.coolingCycle / 3;
                    }
                    // cooling schedule is based on http://www.btluke.com/simanf1.html -> cooling schedule 3
                    this.coolingFactor = Math.max(this.initialCoolingFactor - Math.pow(this.coolingCycle, Math.log(100 * (this.initialCoolingFactor - this.finalTemperature)) / Math.log(this.maxCoolingCycle)) / 100 * this.coolingAdjuster, this.finalTemperature);
                    this.animationPeriod = Math.ceil(this.initialAnimationPeriod * Math.sqrt(this.coolingFactor));
                }
                // Operations while tree is growing again 
                if (this.isTreeGrowing) {
                    if (this.growTreeIterations % 10 == 0) {
                        if (this.prunedNodesAll.length > 0) {
                            this.graphManager.updateBounds();
                            this.updateGrid();
                            this.growTree(this.prunedNodesAll);
                            // Update nodes that gravity will be applied
                            this.graphManager.resetAllNodesToApplyGravitation();
                            var allNodes = new Set(this.getAllNodes());
                            var intersection = this.nodesWithGravity.filter(function(x) {
                                return allNodes.has(x);
                            });
                            this.graphManager.setAllNodesToApplyGravitation(intersection);
                            this.graphManager.updateBounds();
                            this.updateGrid();
                            this.coolingFactor = FDLayoutConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL;
                        } else {
                            this.isTreeGrowing = false;
                            this.isGrowthFinished = true;
                        }
                    }
                    this.growTreeIterations++;
                }
                // Operations after growth is finished
                if (this.isGrowthFinished) {
                    if (this.isConverged()) {
                        return true;
                    }
                    if (this.afterGrowthIterations % 10 == 0) {
                        this.graphManager.updateBounds();
                        this.updateGrid();
                    }
                    this.coolingFactor = FDLayoutConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL * ((100 - this.afterGrowthIterations) / 100);
                    this.afterGrowthIterations++;
                }
                var gridUpdateAllowed = !this.isTreeGrowing && !this.isGrowthFinished;
                var forceToNodeSurroundingUpdate = this.growTreeIterations % 10 == 1 && this.isTreeGrowing || this.afterGrowthIterations % 10 == 1 && this.isGrowthFinished;
                this.totalDisplacement = 0;
                this.graphManager.updateBounds();
                this.calcSpringForces();
                this.calcRepulsionForces(gridUpdateAllowed, forceToNodeSurroundingUpdate);
                this.calcGravitationalForces();
                this.moveNodes();
                this.animate();
                return false; // Layout is not ended yet return false
            };
            CoSELayout.prototype.getPositionsData = function() {
                var allNodes = this.graphManager.getAllNodes();
                var pData = {};
                for(var i = 0; i < allNodes.length; i++){
                    var rect = allNodes[i].rect;
                    var id = allNodes[i].id;
                    pData[id] = {
                        id: id,
                        x: rect.getCenterX(),
                        y: rect.getCenterY(),
                        w: rect.width,
                        h: rect.height
                    };
                }
                return pData;
            };
            CoSELayout.prototype.runSpringEmbedder = function() {
                this.initialAnimationPeriod = 25;
                this.animationPeriod = this.initialAnimationPeriod;
                var layoutEnded = false;
                // If aminate option is 'during' signal that layout is supposed to start iterating
                if (FDLayoutConstants.ANIMATE === 'during') {
                    this.emit('layoutstarted');
                } else {
                    // If aminate option is 'during' tick() function will be called on index.js
                    while(!layoutEnded){
                        layoutEnded = this.tick();
                    }
                    this.graphManager.updateBounds();
                }
            };
            CoSELayout.prototype.calculateNodesToApplyGravitationTo = function() {
                var nodeList = [];
                var graph;
                var graphs = this.graphManager.getGraphs();
                var size = graphs.length;
                var i;
                for(i = 0; i < size; i++){
                    graph = graphs[i];
                    graph.updateConnected();
                    if (!graph.isConnected) {
                        nodeList = nodeList.concat(graph.getNodes());
                    }
                }
                return nodeList;
            };
            CoSELayout.prototype.createBendpoints = function() {
                var edges = [];
                edges = edges.concat(this.graphManager.getAllEdges());
                var visited = new Set();
                var i;
                for(i = 0; i < edges.length; i++){
                    var edge = edges[i];
                    if (!visited.has(edge)) {
                        var source = edge.getSource();
                        var target = edge.getTarget();
                        if (source == target) {
                            edge.getBendpoints().push(new PointD());
                            edge.getBendpoints().push(new PointD());
                            this.createDummyNodesForBendpoints(edge);
                            visited.add(edge);
                        } else {
                            var edgeList = [];
                            edgeList = edgeList.concat(source.getEdgeListToNode(target));
                            edgeList = edgeList.concat(target.getEdgeListToNode(source));
                            if (!visited.has(edgeList[0])) {
                                if (edgeList.length > 1) {
                                    var k;
                                    for(k = 0; k < edgeList.length; k++){
                                        var multiEdge = edgeList[k];
                                        multiEdge.getBendpoints().push(new PointD());
                                        this.createDummyNodesForBendpoints(multiEdge);
                                    }
                                }
                                edgeList.forEach(function(edge) {
                                    visited.add(edge);
                                });
                            }
                        }
                    }
                    if (visited.size == edges.length) {
                        break;
                    }
                }
            };
            CoSELayout.prototype.positionNodesRadially = function(forest) {
                // We tile the trees to a grid row by row; first tree starts at (0,0)
                var currentStartingPoint = new Point(0, 0);
                var numberOfColumns = Math.ceil(Math.sqrt(forest.length));
                var height = 0;
                var currentY = 0;
                var currentX = 0;
                var point = new PointD(0, 0);
                for(var i = 0; i < forest.length; i++){
                    if (i % numberOfColumns == 0) {
                        // Start of a new row, make the x coordinate 0, increment the
                        // y coordinate with the max height of the previous row
                        currentX = 0;
                        currentY = height;
                        if (i != 0) {
                            currentY += CoSEConstants.DEFAULT_COMPONENT_SEPERATION;
                        }
                        height = 0;
                    }
                    var tree = forest[i];
                    // Find the center of the tree
                    var centerNode = Layout.findCenterOfTree(tree);
                    // Set the staring point of the next tree
                    currentStartingPoint.x = currentX;
                    currentStartingPoint.y = currentY;
                    // Do a radial layout starting with the center
                    point = CoSELayout.radialLayout(tree, centerNode, currentStartingPoint);
                    if (point.y > height) {
                        height = Math.floor(point.y);
                    }
                    currentX = Math.floor(point.x + CoSEConstants.DEFAULT_COMPONENT_SEPERATION);
                }
                this.transform(new PointD(LayoutConstants.WORLD_CENTER_X - point.x / 2, LayoutConstants.WORLD_CENTER_Y - point.y / 2));
            };
            CoSELayout.radialLayout = function(tree, centerNode, startingPoint) {
                var radialSep = Math.max(this.maxDiagonalInTree(tree), CoSEConstants.DEFAULT_RADIAL_SEPARATION);
                CoSELayout.branchRadialLayout(centerNode, null, 0, 359, 0, radialSep);
                var bounds = LGraph.calculateBounds(tree);
                var transform = new Transform();
                transform.setDeviceOrgX(bounds.getMinX());
                transform.setDeviceOrgY(bounds.getMinY());
                transform.setWorldOrgX(startingPoint.x);
                transform.setWorldOrgY(startingPoint.y);
                for(var i = 0; i < tree.length; i++){
                    var node = tree[i];
                    node.transform(transform);
                }
                var bottomRight = new PointD(bounds.getMaxX(), bounds.getMaxY());
                return transform.inverseTransformPoint(bottomRight);
            };
            CoSELayout.branchRadialLayout = function(node, parentOfNode, startAngle, endAngle, distance, radialSeparation) {
                // First, position this node by finding its angle.
                var halfInterval = (endAngle - startAngle + 1) / 2;
                if (halfInterval < 0) {
                    halfInterval += 180;
                }
                var nodeAngle = (halfInterval + startAngle) % 360;
                var teta = nodeAngle * IGeometry.TWO_PI / 360;
                // Make polar to java cordinate conversion.
                var cos_teta = Math.cos(teta);
                var x_ = distance * Math.cos(teta);
                var y_ = distance * Math.sin(teta);
                node.setCenter(x_, y_);
                // Traverse all neighbors of this node and recursively call this
                // function.
                var neighborEdges = [];
                neighborEdges = neighborEdges.concat(node.getEdges());
                var childCount = neighborEdges.length;
                if (parentOfNode != null) {
                    childCount--;
                }
                var branchCount = 0;
                var incEdgesCount = neighborEdges.length;
                var startIndex;
                var edges = node.getEdgesBetween(parentOfNode);
                // If there are multiple edges, prune them until there remains only one
                // edge.
                while(edges.length > 1){
                    //neighborEdges.remove(edges.remove(0));
                    var temp = edges[0];
                    edges.splice(0, 1);
                    var index = neighborEdges.indexOf(temp);
                    if (index >= 0) {
                        neighborEdges.splice(index, 1);
                    }
                    incEdgesCount--;
                    childCount--;
                }
                if (parentOfNode != null) {
                    //assert edges.length == 1;
                    startIndex = (neighborEdges.indexOf(edges[0]) + 1) % incEdgesCount;
                } else {
                    startIndex = 0;
                }
                var stepAngle = Math.abs(endAngle - startAngle) / childCount;
                for(var i = startIndex; branchCount != childCount; i = ++i % incEdgesCount){
                    var currentNeighbor = neighborEdges[i].getOtherEnd(node);
                    // Don't back traverse to root node in current tree.
                    if (currentNeighbor == parentOfNode) {
                        continue;
                    }
                    var childStartAngle = (startAngle + branchCount * stepAngle) % 360;
                    var childEndAngle = (childStartAngle + stepAngle) % 360;
                    CoSELayout.branchRadialLayout(currentNeighbor, node, childStartAngle, childEndAngle, distance + radialSeparation, radialSeparation);
                    branchCount++;
                }
            };
            CoSELayout.maxDiagonalInTree = function(tree) {
                var maxDiagonal = Integer.MIN_VALUE;
                for(var i = 0; i < tree.length; i++){
                    var node = tree[i];
                    var diagonal = node.getDiagonal();
                    if (diagonal > maxDiagonal) {
                        maxDiagonal = diagonal;
                    }
                }
                return maxDiagonal;
            };
            CoSELayout.prototype.calcRepulsionRange = function() {
                // formula is 2 x (level + 1) x idealEdgeLength
                return 2 * (this.level + 1) * this.idealEdgeLength;
            };
            // Tiling methods
            // Group zero degree members whose parents are not to be tiled, create dummy parents where needed and fill memberGroups by their dummp parent id's
            CoSELayout.prototype.groupZeroDegreeMembers = function() {
                var self = this;
                // array of [parent_id x oneDegreeNode_id]
                var tempMemberGroups = {}; // A temporary map of parent node and its zero degree members
                this.memberGroups = {}; // A map of dummy parent node and its zero degree members whose parents are not to be tiled
                this.idToDummyNode = {}; // A map of id to dummy node 
                var zeroDegree = []; // List of zero degree nodes whose parents are not to be tiled
                var allNodes = this.graphManager.getAllNodes();
                // Fill zero degree list
                for(var i = 0; i < allNodes.length; i++){
                    var node = allNodes[i];
                    var parent = node.getParent();
                    // If a node has zero degree and its parent is not to be tiled if exists add that node to zeroDegres list
                    if (this.getNodeDegreeWithChildren(node) === 0 && (parent.id == undefined || !this.getToBeTiled(parent))) {
                        zeroDegree.push(node);
                    }
                }
                // Create a map of parent node and its zero degree members
                for(var i = 0; i < zeroDegree.length; i++){
                    var node = zeroDegree[i]; // Zero degree node itself
                    var p_id = node.getParent().id; // Parent id
                    if (typeof tempMemberGroups[p_id] === "undefined") tempMemberGroups[p_id] = [];
                    tempMemberGroups[p_id] = tempMemberGroups[p_id].concat(node); // Push node to the list belongs to its parent in tempMemberGroups
                }
                // If there are at least two nodes at a level, create a dummy compound for them
                Object.keys(tempMemberGroups).forEach(function(p_id) {
                    if (tempMemberGroups[p_id].length > 1) {
                        var dummyCompoundId = "DummyCompound_" + p_id; // The id of dummy compound which will be created soon
                        self.memberGroups[dummyCompoundId] = tempMemberGroups[p_id]; // Add dummy compound to memberGroups
                        var parent = tempMemberGroups[p_id][0].getParent(); // The parent of zero degree nodes will be the parent of new dummy compound
                        // Create a dummy compound with calculated id
                        var dummyCompound = new CoSENode(self.graphManager);
                        dummyCompound.id = dummyCompoundId;
                        dummyCompound.paddingLeft = parent.paddingLeft || 0;
                        dummyCompound.paddingRight = parent.paddingRight || 0;
                        dummyCompound.paddingBottom = parent.paddingBottom || 0;
                        dummyCompound.paddingTop = parent.paddingTop || 0;
                        self.idToDummyNode[dummyCompoundId] = dummyCompound;
                        var dummyParentGraph = self.getGraphManager().add(self.newGraph(), dummyCompound);
                        var parentGraph = parent.getChild();
                        // Add dummy compound to parent the graph
                        parentGraph.add(dummyCompound);
                        // For each zero degree node in this level remove it from its parent graph and add it to the graph of dummy parent
                        for(var i = 0; i < tempMemberGroups[p_id].length; i++){
                            var node = tempMemberGroups[p_id][i];
                            parentGraph.remove(node);
                            dummyParentGraph.add(node);
                        }
                    }
                });
            };
            CoSELayout.prototype.clearCompounds = function() {
                var childGraphMap = {};
                var idToNode = {};
                // Get compound ordering by finding the inner one first
                this.performDFSOnCompounds();
                for(var i = 0; i < this.compoundOrder.length; i++){
                    idToNode[this.compoundOrder[i].id] = this.compoundOrder[i];
                    childGraphMap[this.compoundOrder[i].id] = [].concat(this.compoundOrder[i].getChild().getNodes());
                    // Remove children of compounds
                    this.graphManager.remove(this.compoundOrder[i].getChild());
                    this.compoundOrder[i].child = null;
                }
                this.graphManager.resetAllNodes();
                // Tile the removed children
                this.tileCompoundMembers(childGraphMap, idToNode);
            };
            CoSELayout.prototype.clearZeroDegreeMembers = function() {
                var self = this;
                var tiledZeroDegreePack = this.tiledZeroDegreePack = [];
                Object.keys(this.memberGroups).forEach(function(id) {
                    var compoundNode = self.idToDummyNode[id]; // Get the dummy compound
                    tiledZeroDegreePack[id] = self.tileNodes(self.memberGroups[id], compoundNode.paddingLeft + compoundNode.paddingRight);
                    // Set the width and height of the dummy compound as calculated
                    compoundNode.rect.width = tiledZeroDegreePack[id].width;
                    compoundNode.rect.height = tiledZeroDegreePack[id].height;
                });
            };
            CoSELayout.prototype.repopulateCompounds = function() {
                for(var i = this.compoundOrder.length - 1; i >= 0; i--){
                    var lCompoundNode = this.compoundOrder[i];
                    var id = lCompoundNode.id;
                    var horizontalMargin = lCompoundNode.paddingLeft;
                    var verticalMargin = lCompoundNode.paddingTop;
                    this.adjustLocations(this.tiledMemberPack[id], lCompoundNode.rect.x, lCompoundNode.rect.y, horizontalMargin, verticalMargin);
                }
            };
            CoSELayout.prototype.repopulateZeroDegreeMembers = function() {
                var self = this;
                var tiledPack = this.tiledZeroDegreePack;
                Object.keys(tiledPack).forEach(function(id) {
                    var compoundNode = self.idToDummyNode[id]; // Get the dummy compound by its id
                    var horizontalMargin = compoundNode.paddingLeft;
                    var verticalMargin = compoundNode.paddingTop;
                    // Adjust the positions of nodes wrt its compound
                    self.adjustLocations(tiledPack[id], compoundNode.rect.x, compoundNode.rect.y, horizontalMargin, verticalMargin);
                });
            };
            CoSELayout.prototype.getToBeTiled = function(node) {
                var id = node.id;
                //firstly check the previous results
                if (this.toBeTiled[id] != null) {
                    return this.toBeTiled[id];
                }
                //only compound nodes are to be tiled
                var childGraph = node.getChild();
                if (childGraph == null) {
                    this.toBeTiled[id] = false;
                    return false;
                }
                var children = childGraph.getNodes(); // Get the children nodes
                //a compound node is not to be tiled if all of its compound children are not to be tiled
                for(var i = 0; i < children.length; i++){
                    var theChild = children[i];
                    if (this.getNodeDegree(theChild) > 0) {
                        this.toBeTiled[id] = false;
                        return false;
                    }
                    //pass the children not having the compound structure
                    if (theChild.getChild() == null) {
                        this.toBeTiled[theChild.id] = false;
                        continue;
                    }
                    if (!this.getToBeTiled(theChild)) {
                        this.toBeTiled[id] = false;
                        return false;
                    }
                }
                this.toBeTiled[id] = true;
                return true;
            };
            // Get degree of a node depending of its edges and independent of its children
            CoSELayout.prototype.getNodeDegree = function(node) {
                var id = node.id;
                var edges = node.getEdges();
                var degree = 0;
                // For the edges connected
                for(var i = 0; i < edges.length; i++){
                    var edge = edges[i];
                    if (edge.getSource().id !== edge.getTarget().id) {
                        degree = degree + 1;
                    }
                }
                return degree;
            };
            // Get degree of a node with its children
            CoSELayout.prototype.getNodeDegreeWithChildren = function(node) {
                var degree = this.getNodeDegree(node);
                if (node.getChild() == null) {
                    return degree;
                }
                var children = node.getChild().getNodes();
                for(var i = 0; i < children.length; i++){
                    var child = children[i];
                    degree += this.getNodeDegreeWithChildren(child);
                }
                return degree;
            };
            CoSELayout.prototype.performDFSOnCompounds = function() {
                this.compoundOrder = [];
                this.fillCompexOrderByDFS(this.graphManager.getRoot().getNodes());
            };
            CoSELayout.prototype.fillCompexOrderByDFS = function(children) {
                for(var i = 0; i < children.length; i++){
                    var child = children[i];
                    if (child.getChild() != null) {
                        this.fillCompexOrderByDFS(child.getChild().getNodes());
                    }
                    if (this.getToBeTiled(child)) {
                        this.compoundOrder.push(child);
                    }
                }
            };
            /**
* This method places each zero degree member wrt given (x,y) coordinates (top left).
*/ CoSELayout.prototype.adjustLocations = function(organization, x, y, compoundHorizontalMargin, compoundVerticalMargin) {
                x += compoundHorizontalMargin;
                y += compoundVerticalMargin;
                var left = x;
                for(var i = 0; i < organization.rows.length; i++){
                    var row = organization.rows[i];
                    x = left;
                    var maxHeight = 0;
                    for(var j = 0; j < row.length; j++){
                        var lnode = row[j];
                        lnode.rect.x = x; // + lnode.rect.width / 2;
                        lnode.rect.y = y; // + lnode.rect.height / 2;
                        x += lnode.rect.width + organization.horizontalPadding;
                        if (lnode.rect.height > maxHeight) maxHeight = lnode.rect.height;
                    }
                    y += maxHeight + organization.verticalPadding;
                }
            };
            CoSELayout.prototype.tileCompoundMembers = function(childGraphMap, idToNode) {
                var self = this;
                this.tiledMemberPack = [];
                Object.keys(childGraphMap).forEach(function(id) {
                    // Get the compound node
                    var compoundNode = idToNode[id];
                    self.tiledMemberPack[id] = self.tileNodes(childGraphMap[id], compoundNode.paddingLeft + compoundNode.paddingRight);
                    compoundNode.rect.width = self.tiledMemberPack[id].width;
                    compoundNode.rect.height = self.tiledMemberPack[id].height;
                });
            };
            CoSELayout.prototype.tileNodes = function(nodes, minWidth) {
                var verticalPadding = CoSEConstants.TILING_PADDING_VERTICAL;
                var horizontalPadding = CoSEConstants.TILING_PADDING_HORIZONTAL;
                var organization = {
                    rows: [],
                    rowWidth: [],
                    rowHeight: [],
                    width: 0,
                    height: minWidth,
                    verticalPadding: verticalPadding,
                    horizontalPadding: horizontalPadding
                };
                // Sort the nodes in ascending order of their areas
                nodes.sort(function(n1, n2) {
                    if (n1.rect.width * n1.rect.height > n2.rect.width * n2.rect.height) return -1;
                    if (n1.rect.width * n1.rect.height < n2.rect.width * n2.rect.height) return 1;
                    return 0;
                });
                // Create the organization -> tile members
                for(var i = 0; i < nodes.length; i++){
                    var lNode = nodes[i];
                    if (organization.rows.length == 0) {
                        this.insertNodeToRow(organization, lNode, 0, minWidth);
                    } else if (this.canAddHorizontal(organization, lNode.rect.width, lNode.rect.height)) {
                        this.insertNodeToRow(organization, lNode, this.getShortestRowIndex(organization), minWidth);
                    } else {
                        this.insertNodeToRow(organization, lNode, organization.rows.length, minWidth);
                    }
                    this.shiftToLastRow(organization);
                }
                return organization;
            };
            CoSELayout.prototype.insertNodeToRow = function(organization, node, rowIndex, minWidth) {
                var minCompoundSize = minWidth;
                // Add new row if needed
                if (rowIndex == organization.rows.length) {
                    var secondDimension = [];
                    organization.rows.push(secondDimension);
                    organization.rowWidth.push(minCompoundSize);
                    organization.rowHeight.push(0);
                }
                // Update row width
                var w = organization.rowWidth[rowIndex] + node.rect.width;
                if (organization.rows[rowIndex].length > 0) {
                    w += organization.horizontalPadding;
                }
                organization.rowWidth[rowIndex] = w;
                // Update compound width
                if (organization.width < w) {
                    organization.width = w;
                }
                // Update height
                var h = node.rect.height;
                if (rowIndex > 0) h += organization.verticalPadding;
                var extraHeight = 0;
                if (h > organization.rowHeight[rowIndex]) {
                    extraHeight = organization.rowHeight[rowIndex];
                    organization.rowHeight[rowIndex] = h;
                    extraHeight = organization.rowHeight[rowIndex] - extraHeight;
                }
                organization.height += extraHeight;
                // Insert node
                organization.rows[rowIndex].push(node);
            };
            //Scans the rows of an organization and returns the one with the min width
            CoSELayout.prototype.getShortestRowIndex = function(organization) {
                var r = -1;
                var min = Number.MAX_VALUE;
                for(var i = 0; i < organization.rows.length; i++){
                    if (organization.rowWidth[i] < min) {
                        r = i;
                        min = organization.rowWidth[i];
                    }
                }
                return r;
            };
            //Scans the rows of an organization and returns the one with the max width
            CoSELayout.prototype.getLongestRowIndex = function(organization) {
                var r = -1;
                var max = Number.MIN_VALUE;
                for(var i = 0; i < organization.rows.length; i++){
                    if (organization.rowWidth[i] > max) {
                        r = i;
                        max = organization.rowWidth[i];
                    }
                }
                return r;
            };
            /**
* This method checks whether adding extra width to the organization violates
* the aspect ratio(1) or not.
*/ CoSELayout.prototype.canAddHorizontal = function(organization, extraWidth, extraHeight) {
                var sri = this.getShortestRowIndex(organization);
                if (sri < 0) {
                    return true;
                }
                var min = organization.rowWidth[sri];
                if (min + organization.horizontalPadding + extraWidth <= organization.width) return true;
                var hDiff = 0;
                // Adding to an existing row
                if (organization.rowHeight[sri] < extraHeight) {
                    if (sri > 0) hDiff = extraHeight + organization.verticalPadding - organization.rowHeight[sri];
                }
                var add_to_row_ratio;
                if (organization.width - min >= extraWidth + organization.horizontalPadding) {
                    add_to_row_ratio = (organization.height + hDiff) / (min + extraWidth + organization.horizontalPadding);
                } else {
                    add_to_row_ratio = (organization.height + hDiff) / organization.width;
                }
                // Adding a new row for this node
                hDiff = extraHeight + organization.verticalPadding;
                var add_new_row_ratio;
                if (organization.width < extraWidth) {
                    add_new_row_ratio = (organization.height + hDiff) / extraWidth;
                } else {
                    add_new_row_ratio = (organization.height + hDiff) / organization.width;
                }
                if (add_new_row_ratio < 1) add_new_row_ratio = 1 / add_new_row_ratio;
                if (add_to_row_ratio < 1) add_to_row_ratio = 1 / add_to_row_ratio;
                return add_to_row_ratio < add_new_row_ratio;
            };
            //If moving the last node from the longest row and adding it to the last
            //row makes the bounding box smaller, do it.
            CoSELayout.prototype.shiftToLastRow = function(organization) {
                var longest = this.getLongestRowIndex(organization);
                var last = organization.rowWidth.length - 1;
                var row = organization.rows[longest];
                var node = row[row.length - 1];
                var diff = node.width + organization.horizontalPadding;
                // Check if there is enough space on the last row
                if (organization.width - organization.rowWidth[last] > diff && longest != last) {
                    // Remove the last element of the longest row
                    row.splice(-1, 1);
                    // Push it to the last row
                    organization.rows[last].push(node);
                    organization.rowWidth[longest] = organization.rowWidth[longest] - diff;
                    organization.rowWidth[last] = organization.rowWidth[last] + diff;
                    organization.width = organization.rowWidth[instance.getLongestRowIndex(organization)];
                    // Update heights of the organization
                    var maxHeight = Number.MIN_VALUE;
                    for(var i = 0; i < row.length; i++){
                        if (row[i].height > maxHeight) maxHeight = row[i].height;
                    }
                    if (longest > 0) maxHeight += organization.verticalPadding;
                    var prevTotal = organization.rowHeight[longest] + organization.rowHeight[last];
                    organization.rowHeight[longest] = maxHeight;
                    if (organization.rowHeight[last] < node.height + organization.verticalPadding) organization.rowHeight[last] = node.height + organization.verticalPadding;
                    var finalTotal = organization.rowHeight[longest] + organization.rowHeight[last];
                    organization.height += finalTotal - prevTotal;
                    this.shiftToLastRow(organization);
                }
            };
            CoSELayout.prototype.tilingPreLayout = function() {
                if (CoSEConstants.TILE) {
                    // Find zero degree nodes and create a compound for each level
                    this.groupZeroDegreeMembers();
                    // Tile and clear children of each compound
                    this.clearCompounds();
                    // Separately tile and clear zero degree nodes for each level
                    this.clearZeroDegreeMembers();
                }
            };
            CoSELayout.prototype.tilingPostLayout = function() {
                if (CoSEConstants.TILE) {
                    this.repopulateZeroDegreeMembers();
                    this.repopulateCompounds();
                }
            };
            // -----------------------------------------------------------------------------
            // Section: Tree Reduction methods
            // -----------------------------------------------------------------------------
            // Reduce trees 
            CoSELayout.prototype.reduceTrees = function() {
                var prunedNodesAll = [];
                var containsLeaf = true;
                var node;
                while(containsLeaf){
                    var allNodes = this.graphManager.getAllNodes();
                    var prunedNodesInStepTemp = [];
                    containsLeaf = false;
                    for(var i = 0; i < allNodes.length; i++){
                        node = allNodes[i];
                        if (node.getEdges().length == 1 && !node.getEdges()[0].isInterGraph && node.getChild() == null) {
                            prunedNodesInStepTemp.push([
                                node,
                                node.getEdges()[0],
                                node.getOwner()
                            ]);
                            containsLeaf = true;
                        }
                    }
                    if (containsLeaf == true) {
                        var prunedNodesInStep = [];
                        for(var j = 0; j < prunedNodesInStepTemp.length; j++){
                            if (prunedNodesInStepTemp[j][0].getEdges().length == 1) {
                                prunedNodesInStep.push(prunedNodesInStepTemp[j]);
                                prunedNodesInStepTemp[j][0].getOwner().remove(prunedNodesInStepTemp[j][0]);
                            }
                        }
                        prunedNodesAll.push(prunedNodesInStep);
                        this.graphManager.resetAllNodes();
                        this.graphManager.resetAllEdges();
                    }
                }
                this.prunedNodesAll = prunedNodesAll;
            };
            // Grow tree one step 
            CoSELayout.prototype.growTree = function(prunedNodesAll) {
                var lengthOfPrunedNodesInStep = prunedNodesAll.length;
                var prunedNodesInStep = prunedNodesAll[lengthOfPrunedNodesInStep - 1];
                var nodeData;
                for(var i = 0; i < prunedNodesInStep.length; i++){
                    nodeData = prunedNodesInStep[i];
                    this.findPlaceforPrunedNode(nodeData);
                    nodeData[2].add(nodeData[0]);
                    nodeData[2].add(nodeData[1], nodeData[1].source, nodeData[1].target);
                }
                prunedNodesAll.splice(prunedNodesAll.length - 1, 1);
                this.graphManager.resetAllNodes();
                this.graphManager.resetAllEdges();
            };
            // Find an appropriate position to replace pruned node, this method can be improved
            CoSELayout.prototype.findPlaceforPrunedNode = function(nodeData) {
                var gridForPrunedNode;
                var nodeToConnect;
                var prunedNode = nodeData[0];
                if (prunedNode == nodeData[1].source) {
                    nodeToConnect = nodeData[1].target;
                } else {
                    nodeToConnect = nodeData[1].source;
                }
                var startGridX = nodeToConnect.startX;
                var finishGridX = nodeToConnect.finishX;
                var startGridY = nodeToConnect.startY;
                var finishGridY = nodeToConnect.finishY;
                var upNodeCount = 0;
                var downNodeCount = 0;
                var rightNodeCount = 0;
                var leftNodeCount = 0;
                var controlRegions = [
                    upNodeCount,
                    rightNodeCount,
                    downNodeCount,
                    leftNodeCount
                ];
                if (startGridY > 0) {
                    for(var i = startGridX; i <= finishGridX; i++){
                        controlRegions[0] += this.grid[i][startGridY - 1].length + this.grid[i][startGridY].length - 1;
                    }
                }
                if (finishGridX < this.grid.length - 1) {
                    for(var i = startGridY; i <= finishGridY; i++){
                        controlRegions[1] += this.grid[finishGridX + 1][i].length + this.grid[finishGridX][i].length - 1;
                    }
                }
                if (finishGridY < this.grid[0].length - 1) {
                    for(var i = startGridX; i <= finishGridX; i++){
                        controlRegions[2] += this.grid[i][finishGridY + 1].length + this.grid[i][finishGridY].length - 1;
                    }
                }
                if (startGridX > 0) {
                    for(var i = startGridY; i <= finishGridY; i++){
                        controlRegions[3] += this.grid[startGridX - 1][i].length + this.grid[startGridX][i].length - 1;
                    }
                }
                var min = Integer.MAX_VALUE;
                var minCount;
                var minIndex;
                for(var j = 0; j < controlRegions.length; j++){
                    if (controlRegions[j] < min) {
                        min = controlRegions[j];
                        minCount = 1;
                        minIndex = j;
                    } else if (controlRegions[j] == min) {
                        minCount++;
                    }
                }
                if (minCount == 3 && min == 0) {
                    if (controlRegions[0] == 0 && controlRegions[1] == 0 && controlRegions[2] == 0) {
                        gridForPrunedNode = 1;
                    } else if (controlRegions[0] == 0 && controlRegions[1] == 0 && controlRegions[3] == 0) {
                        gridForPrunedNode = 0;
                    } else if (controlRegions[0] == 0 && controlRegions[2] == 0 && controlRegions[3] == 0) {
                        gridForPrunedNode = 3;
                    } else if (controlRegions[1] == 0 && controlRegions[2] == 0 && controlRegions[3] == 0) {
                        gridForPrunedNode = 2;
                    }
                } else if (minCount == 2 && min == 0) {
                    var random = Math.floor(Math.random() * 2);
                    if (controlRegions[0] == 0 && controlRegions[1] == 0) {
                        ;
                        if (random == 0) {
                            gridForPrunedNode = 0;
                        } else {
                            gridForPrunedNode = 1;
                        }
                    } else if (controlRegions[0] == 0 && controlRegions[2] == 0) {
                        if (random == 0) {
                            gridForPrunedNode = 0;
                        } else {
                            gridForPrunedNode = 2;
                        }
                    } else if (controlRegions[0] == 0 && controlRegions[3] == 0) {
                        if (random == 0) {
                            gridForPrunedNode = 0;
                        } else {
                            gridForPrunedNode = 3;
                        }
                    } else if (controlRegions[1] == 0 && controlRegions[2] == 0) {
                        if (random == 0) {
                            gridForPrunedNode = 1;
                        } else {
                            gridForPrunedNode = 2;
                        }
                    } else if (controlRegions[1] == 0 && controlRegions[3] == 0) {
                        if (random == 0) {
                            gridForPrunedNode = 1;
                        } else {
                            gridForPrunedNode = 3;
                        }
                    } else {
                        if (random == 0) {
                            gridForPrunedNode = 2;
                        } else {
                            gridForPrunedNode = 3;
                        }
                    }
                } else if (minCount == 4 && min == 0) {
                    var random = Math.floor(Math.random() * 4);
                    gridForPrunedNode = random;
                } else {
                    gridForPrunedNode = minIndex;
                }
                if (gridForPrunedNode == 0) {
                    prunedNode.setCenter(nodeToConnect.getCenterX(), nodeToConnect.getCenterY() - nodeToConnect.getHeight() / 2 - FDLayoutConstants.DEFAULT_EDGE_LENGTH - prunedNode.getHeight() / 2);
                } else if (gridForPrunedNode == 1) {
                    prunedNode.setCenter(nodeToConnect.getCenterX() + nodeToConnect.getWidth() / 2 + FDLayoutConstants.DEFAULT_EDGE_LENGTH + prunedNode.getWidth() / 2, nodeToConnect.getCenterY());
                } else if (gridForPrunedNode == 2) {
                    prunedNode.setCenter(nodeToConnect.getCenterX(), nodeToConnect.getCenterY() + nodeToConnect.getHeight() / 2 + FDLayoutConstants.DEFAULT_EDGE_LENGTH + prunedNode.getHeight() / 2);
                } else {
                    prunedNode.setCenter(nodeToConnect.getCenterX() - nodeToConnect.getWidth() / 2 - FDLayoutConstants.DEFAULT_EDGE_LENGTH - prunedNode.getWidth() / 2, nodeToConnect.getCenterY());
                }
            };
            module1.exports = CoSELayout;
        /***/ },
        function(module1, exports, __webpack_require__) {
            "use strict";
            var coseBase = {};
            coseBase.layoutBase = __webpack_require__(0);
            coseBase.CoSEConstants = __webpack_require__(1);
            coseBase.CoSEEdge = __webpack_require__(2);
            coseBase.CoSEGraph = __webpack_require__(3);
            coseBase.CoSEGraphManager = __webpack_require__(4);
            coseBase.CoSELayout = __webpack_require__(6);
            coseBase.CoSENode = __webpack_require__(5);
            module1.exports = coseBase;
        /***/ }
    ]);
});
}),
"[project]/frontend/node_modules/cytoscape-cose-bilkent/cytoscape-cose-bilkent.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

(function webpackUniversalModuleDefinition(root, factory) {
    if ("TURBOPACK compile-time truthy", 1) module.exports = factory(__turbopack_context__.r("[project]/frontend/node_modules/cose-base/cose-base.js [app-client] (ecmascript)"));
    else //TURBOPACK unreachable
    ;
})(/*TURBOPACK member replacement*/ __turbopack_context__.e, function(__WEBPACK_EXTERNAL_MODULE_0__) {
    return /******/ function(modules) {
        /******/ // The module cache
        /******/ var installedModules = {};
        /******/ /******/ // The require function
        /******/ function __webpack_require__(moduleId) {
            /******/ /******/ // Check if module is in cache
            /******/ if (installedModules[moduleId]) {
                /******/ return installedModules[moduleId].exports;
            /******/ }
            /******/ // Create a new module (and put it into the cache)
            /******/ var module1 = installedModules[moduleId] = {
                /******/ i: moduleId,
                /******/ l: false,
                /******/ exports: {}
            };
            /******/ /******/ // Execute the module function
            /******/ modules[moduleId].call(module1.exports, module1, module1.exports, __webpack_require__);
            /******/ /******/ // Flag the module as loaded
            /******/ module1.l = true;
            /******/ /******/ // Return the exports of the module
            /******/ return module1.exports;
        /******/ }
        /******/ /******/ /******/ // expose the modules object (__webpack_modules__)
        /******/ __webpack_require__.m = modules;
        /******/ /******/ // expose the module cache
        /******/ __webpack_require__.c = installedModules;
        /******/ /******/ // identity function for calling harmony imports with the correct context
        /******/ __webpack_require__.i = function(value) {
            return value;
        };
        /******/ /******/ // define getter function for harmony exports
        /******/ __webpack_require__.d = function(exports, name, getter) {
            /******/ if (!__webpack_require__.o(exports, name)) {
                /******/ Object.defineProperty(exports, name, {
                    /******/ configurable: false,
                    /******/ enumerable: true,
                    /******/ get: getter
                });
            /******/ }
        /******/ };
        /******/ /******/ // getDefaultExport function for compatibility with non-harmony modules
        /******/ __webpack_require__.n = function(module1) {
            /******/ var getter = module1 && module1.__esModule ? /******/ function getDefault() {
                return module1['default'];
            } : /******/ function getModuleExports() {
                return module1;
            };
            /******/ __webpack_require__.d(getter, 'a', getter);
            /******/ return getter;
        /******/ };
        /******/ /******/ // Object.prototype.hasOwnProperty.call
        /******/ __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        };
        /******/ /******/ // __webpack_public_path__
        /******/ __webpack_require__.p = "";
        /******/ /******/ // Load entry module and return exports
        /******/ return __webpack_require__(__webpack_require__.s = 1);
    /******/ }([
        function(module1, exports) {
            module1.exports = __WEBPACK_EXTERNAL_MODULE_0__;
        /***/ },
        function(module1, exports, __webpack_require__) {
            "use strict";
            var LayoutConstants = __webpack_require__(0).layoutBase.LayoutConstants;
            var FDLayoutConstants = __webpack_require__(0).layoutBase.FDLayoutConstants;
            var CoSEConstants = __webpack_require__(0).CoSEConstants;
            var CoSELayout = __webpack_require__(0).CoSELayout;
            var CoSENode = __webpack_require__(0).CoSENode;
            var PointD = __webpack_require__(0).layoutBase.PointD;
            var DimensionD = __webpack_require__(0).layoutBase.DimensionD;
            var defaults = {
                // Called on `layoutready`
                ready: function ready() {},
                // Called on `layoutstop`
                stop: function stop() {},
                // 'draft', 'default' or 'proof" 
                // - 'draft' fast cooling rate 
                // - 'default' moderate cooling rate 
                // - "proof" slow cooling rate
                quality: 'default',
                // include labels in node dimensions
                nodeDimensionsIncludeLabels: false,
                // number of ticks per frame; higher is faster but more jerky
                refresh: 30,
                // Whether to fit the network view after when done
                fit: true,
                // Padding on fit
                padding: 10,
                // Whether to enable incremental mode
                randomize: true,
                // Node repulsion (non overlapping) multiplier
                nodeRepulsion: 4500,
                // Ideal edge (non nested) length
                idealEdgeLength: 50,
                // Divisor to compute edge forces
                edgeElasticity: 0.45,
                // Nesting factor (multiplier) to compute ideal edge length for nested edges
                nestingFactor: 0.1,
                // Gravity force (constant)
                gravity: 0.25,
                // Maximum number of iterations to perform
                numIter: 2500,
                // For enabling tiling
                tile: true,
                // Type of layout animation. The option set is {'during', 'end', false}
                animate: 'end',
                // Duration for animate:end
                animationDuration: 500,
                // Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
                tilingPaddingVertical: 10,
                // Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
                tilingPaddingHorizontal: 10,
                // Gravity range (constant) for compounds
                gravityRangeCompound: 1.5,
                // Gravity force (constant) for compounds
                gravityCompound: 1.0,
                // Gravity range (constant)
                gravityRange: 3.8,
                // Initial cooling factor for incremental layout
                initialEnergyOnIncremental: 0.5
            };
            function extend(defaults, options) {
                var obj = {};
                for(var i in defaults){
                    obj[i] = defaults[i];
                }
                for(var i in options){
                    obj[i] = options[i];
                }
                return obj;
            }
            ;
            function _CoSELayout(_options) {
                this.options = extend(defaults, _options);
                getUserOptions(this.options);
            }
            var getUserOptions = function getUserOptions(options) {
                if (options.nodeRepulsion != null) CoSEConstants.DEFAULT_REPULSION_STRENGTH = FDLayoutConstants.DEFAULT_REPULSION_STRENGTH = options.nodeRepulsion;
                if (options.idealEdgeLength != null) CoSEConstants.DEFAULT_EDGE_LENGTH = FDLayoutConstants.DEFAULT_EDGE_LENGTH = options.idealEdgeLength;
                if (options.edgeElasticity != null) CoSEConstants.DEFAULT_SPRING_STRENGTH = FDLayoutConstants.DEFAULT_SPRING_STRENGTH = options.edgeElasticity;
                if (options.nestingFactor != null) CoSEConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = FDLayoutConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = options.nestingFactor;
                if (options.gravity != null) CoSEConstants.DEFAULT_GRAVITY_STRENGTH = FDLayoutConstants.DEFAULT_GRAVITY_STRENGTH = options.gravity;
                if (options.numIter != null) CoSEConstants.MAX_ITERATIONS = FDLayoutConstants.MAX_ITERATIONS = options.numIter;
                if (options.gravityRange != null) CoSEConstants.DEFAULT_GRAVITY_RANGE_FACTOR = FDLayoutConstants.DEFAULT_GRAVITY_RANGE_FACTOR = options.gravityRange;
                if (options.gravityCompound != null) CoSEConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = options.gravityCompound;
                if (options.gravityRangeCompound != null) CoSEConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = options.gravityRangeCompound;
                if (options.initialEnergyOnIncremental != null) CoSEConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL = FDLayoutConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL = options.initialEnergyOnIncremental;
                if (options.quality == 'draft') LayoutConstants.QUALITY = 0;
                else if (options.quality == 'proof') LayoutConstants.QUALITY = 2;
                else LayoutConstants.QUALITY = 1;
                CoSEConstants.NODE_DIMENSIONS_INCLUDE_LABELS = FDLayoutConstants.NODE_DIMENSIONS_INCLUDE_LABELS = LayoutConstants.NODE_DIMENSIONS_INCLUDE_LABELS = options.nodeDimensionsIncludeLabels;
                CoSEConstants.DEFAULT_INCREMENTAL = FDLayoutConstants.DEFAULT_INCREMENTAL = LayoutConstants.DEFAULT_INCREMENTAL = !options.randomize;
                CoSEConstants.ANIMATE = FDLayoutConstants.ANIMATE = LayoutConstants.ANIMATE = options.animate;
                CoSEConstants.TILE = options.tile;
                CoSEConstants.TILING_PADDING_VERTICAL = typeof options.tilingPaddingVertical === 'function' ? options.tilingPaddingVertical.call() : options.tilingPaddingVertical;
                CoSEConstants.TILING_PADDING_HORIZONTAL = typeof options.tilingPaddingHorizontal === 'function' ? options.tilingPaddingHorizontal.call() : options.tilingPaddingHorizontal;
            };
            _CoSELayout.prototype.run = function() {
                var ready;
                var frameId;
                var options = this.options;
                var idToLNode = this.idToLNode = {};
                var layout = this.layout = new CoSELayout();
                var self = this;
                self.stopped = false;
                this.cy = this.options.cy;
                this.cy.trigger({
                    type: 'layoutstart',
                    layout: this
                });
                var gm = layout.newGraphManager();
                this.gm = gm;
                var nodes = this.options.eles.nodes();
                var edges = this.options.eles.edges();
                this.root = gm.addRoot();
                this.processChildrenList(this.root, this.getTopMostNodes(nodes), layout);
                for(var i = 0; i < edges.length; i++){
                    var edge = edges[i];
                    var sourceNode = this.idToLNode[edge.data("source")];
                    var targetNode = this.idToLNode[edge.data("target")];
                    if (sourceNode !== targetNode && sourceNode.getEdgesBetween(targetNode).length == 0) {
                        var e1 = gm.add(layout.newEdge(), sourceNode, targetNode);
                        e1.id = edge.id();
                    }
                }
                var getPositions = function getPositions(ele, i) {
                    if (typeof ele === "number") {
                        ele = i;
                    }
                    var theId = ele.data('id');
                    var lNode = self.idToLNode[theId];
                    return {
                        x: lNode.getRect().getCenterX(),
                        y: lNode.getRect().getCenterY()
                    };
                };
                /*
   * Reposition nodes in iterations animatedly
   */ var iterateAnimated = function iterateAnimated() {
                    // Thigs to perform after nodes are repositioned on screen
                    var afterReposition = function afterReposition() {
                        if (options.fit) {
                            options.cy.fit(options.eles, options.padding);
                        }
                        if (!ready) {
                            ready = true;
                            self.cy.one('layoutready', options.ready);
                            self.cy.trigger({
                                type: 'layoutready',
                                layout: self
                            });
                        }
                    };
                    var ticksPerFrame = self.options.refresh;
                    var isDone;
                    for(var i = 0; i < ticksPerFrame && !isDone; i++){
                        isDone = self.stopped || self.layout.tick();
                    }
                    // If layout is done
                    if (isDone) {
                        // If the layout is not a sublayout and it is successful perform post layout.
                        if (layout.checkLayoutSuccess() && !layout.isSubLayout) {
                            layout.doPostLayout();
                        }
                        // If layout has a tilingPostLayout function property call it.
                        if (layout.tilingPostLayout) {
                            layout.tilingPostLayout();
                        }
                        layout.isLayoutFinished = true;
                        self.options.eles.nodes().positions(getPositions);
                        afterReposition();
                        // trigger layoutstop when the layout stops (e.g. finishes)
                        self.cy.one('layoutstop', self.options.stop);
                        self.cy.trigger({
                            type: 'layoutstop',
                            layout: self
                        });
                        if (frameId) {
                            cancelAnimationFrame(frameId);
                        }
                        ready = false;
                        return;
                    }
                    var animationData = self.layout.getPositionsData(); // Get positions of layout nodes note that all nodes may not be layout nodes because of tiling
                    // Position nodes, for the nodes whose id does not included in data (because they are removed from their parents and included in dummy compounds)
                    // use position of their ancestors or dummy ancestors
                    options.eles.nodes().positions(function(ele, i) {
                        if (typeof ele === "number") {
                            ele = i;
                        }
                        // If ele is a compound node, then its position will be defined by its children
                        if (!ele.isParent()) {
                            var theId = ele.id();
                            var pNode = animationData[theId];
                            var temp = ele;
                            // If pNode is undefined search until finding position data of its first ancestor (It may be dummy as well)
                            while(pNode == null){
                                pNode = animationData[temp.data('parent')] || animationData['DummyCompound_' + temp.data('parent')];
                                animationData[theId] = pNode;
                                temp = temp.parent()[0];
                                if (temp == undefined) {
                                    break;
                                }
                            }
                            if (pNode != null) {
                                return {
                                    x: pNode.x,
                                    y: pNode.y
                                };
                            } else {
                                return {
                                    x: ele.position('x'),
                                    y: ele.position('y')
                                };
                            }
                        }
                    });
                    afterReposition();
                    frameId = requestAnimationFrame(iterateAnimated);
                };
                /*
  * Listen 'layoutstarted' event and start animated iteration if animate option is 'during'
  */ layout.addListener('layoutstarted', function() {
                    if (self.options.animate === 'during') {
                        frameId = requestAnimationFrame(iterateAnimated);
                    }
                });
                layout.runLayout(); // Run cose layout
                /*
   * If animate option is not 'during' ('end' or false) perform these here (If it is 'during' similar things are already performed)
   */ if (this.options.animate !== "during") {
                    self.options.eles.nodes().not(":parent").layoutPositions(self, self.options, getPositions); // Use layout positions to reposition the nodes it considers the options parameter
                    ready = false;
                }
                return this; // chaining
            };
            //Get the top most ones of a list of nodes
            _CoSELayout.prototype.getTopMostNodes = function(nodes) {
                var nodesMap = {};
                for(var i = 0; i < nodes.length; i++){
                    nodesMap[nodes[i].id()] = true;
                }
                var roots = nodes.filter(function(ele, i) {
                    if (typeof ele === "number") {
                        ele = i;
                    }
                    var parent = ele.parent()[0];
                    while(parent != null){
                        if (nodesMap[parent.id()]) {
                            return false;
                        }
                        parent = parent.parent()[0];
                    }
                    return true;
                });
                return roots;
            };
            _CoSELayout.prototype.processChildrenList = function(parent, children, layout) {
                var size = children.length;
                for(var i = 0; i < size; i++){
                    var theChild = children[i];
                    var children_of_children = theChild.children();
                    var theNode;
                    var dimensions = theChild.layoutDimensions({
                        nodeDimensionsIncludeLabels: this.options.nodeDimensionsIncludeLabels
                    });
                    if (theChild.outerWidth() != null && theChild.outerHeight() != null) {
                        theNode = parent.add(new CoSENode(layout.graphManager, new PointD(theChild.position('x') - dimensions.w / 2, theChild.position('y') - dimensions.h / 2), new DimensionD(parseFloat(dimensions.w), parseFloat(dimensions.h))));
                    } else {
                        theNode = parent.add(new CoSENode(this.graphManager));
                    }
                    // Attach id to the layout node
                    theNode.id = theChild.data("id");
                    // Attach the paddings of cy node to layout node
                    theNode.paddingLeft = parseInt(theChild.css('padding'));
                    theNode.paddingTop = parseInt(theChild.css('padding'));
                    theNode.paddingRight = parseInt(theChild.css('padding'));
                    theNode.paddingBottom = parseInt(theChild.css('padding'));
                    //Attach the label properties to compound if labels will be included in node dimensions  
                    if (this.options.nodeDimensionsIncludeLabels) {
                        if (theChild.isParent()) {
                            var labelWidth = theChild.boundingBox({
                                includeLabels: true,
                                includeNodes: false
                            }).w;
                            var labelHeight = theChild.boundingBox({
                                includeLabels: true,
                                includeNodes: false
                            }).h;
                            var labelPos = theChild.css("text-halign");
                            theNode.labelWidth = labelWidth;
                            theNode.labelHeight = labelHeight;
                            theNode.labelPos = labelPos;
                        }
                    }
                    // Map the layout node
                    this.idToLNode[theChild.data("id")] = theNode;
                    if (isNaN(theNode.rect.x)) {
                        theNode.rect.x = 0;
                    }
                    if (isNaN(theNode.rect.y)) {
                        theNode.rect.y = 0;
                    }
                    if (children_of_children != null && children_of_children.length > 0) {
                        var theNewGraph;
                        theNewGraph = layout.getGraphManager().add(layout.newGraph(), theNode);
                        this.processChildrenList(theNewGraph, children_of_children, layout);
                    }
                }
            };
            /**
 * @brief : called on continuous layouts to stop them before they finish
 */ _CoSELayout.prototype.stop = function() {
                this.stopped = true;
                return this; // chaining
            };
            var register = function register(cytoscape1) {
                //  var Layout = getLayout( cytoscape );
                cytoscape1('layout', 'cose-bilkent', _CoSELayout);
            };
            // auto reg for globals
            if (typeof cytoscape !== 'undefined') {
                register(cytoscape);
            }
            module1.exports = register;
        /***/ }
    ]);
});
}),
"[project]/frontend/node_modules/d3-brush/src/brush.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "brushSelection",
    ()=>brushSelection,
    "brushX",
    ()=>brushX,
    "brushY",
    ()=>brushY,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$dispatch$2f$src$2f$dispatch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__dispatch$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-dispatch/src/dispatch.js [app-client] (ecmascript) <export default as dispatch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$nodrag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__dragDisable$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-drag/src/nodrag.js [app-client] (ecmascript) <export default as dragDisable>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$nodrag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__yesdrag__as__dragEnable$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-drag/src/nodrag.js [app-client] (ecmascript) <export yesdrag as dragEnable>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$value$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interpolate$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/value.js [app-client] (ecmascript) <export default as interpolate>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__pointer$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/pointer.js [app-client] (ecmascript) <export default as pointer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/select.js [app-client] (ecmascript) <export default as select>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interrupt$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/interrupt.js [app-client] (ecmascript) <export default as interrupt>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-brush/src/constant.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$event$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-brush/src/event.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-brush/src/noevent.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
var MODE_DRAG = {
    name: "drag"
}, MODE_SPACE = {
    name: "space"
}, MODE_HANDLE = {
    name: "handle"
}, MODE_CENTER = {
    name: "center"
};
const { abs, max, min } = Math;
function number1(e) {
    return [
        +e[0],
        +e[1]
    ];
}
function number2(e) {
    return [
        number1(e[0]),
        number1(e[1])
    ];
}
var X = {
    name: "x",
    handles: [
        "w",
        "e"
    ].map(type),
    input: function(x, e) {
        return x == null ? null : [
            [
                +x[0],
                e[0][1]
            ],
            [
                +x[1],
                e[1][1]
            ]
        ];
    },
    output: function(xy) {
        return xy && [
            xy[0][0],
            xy[1][0]
        ];
    }
};
var Y = {
    name: "y",
    handles: [
        "n",
        "s"
    ].map(type),
    input: function(y, e) {
        return y == null ? null : [
            [
                e[0][0],
                +y[0]
            ],
            [
                e[1][0],
                +y[1]
            ]
        ];
    },
    output: function(xy) {
        return xy && [
            xy[0][1],
            xy[1][1]
        ];
    }
};
var XY = {
    name: "xy",
    handles: [
        "n",
        "w",
        "e",
        "s",
        "nw",
        "ne",
        "sw",
        "se"
    ].map(type),
    input: function(xy) {
        return xy == null ? null : number2(xy);
    },
    output: function(xy) {
        return xy;
    }
};
var cursors = {
    overlay: "crosshair",
    selection: "move",
    n: "ns-resize",
    e: "ew-resize",
    s: "ns-resize",
    w: "ew-resize",
    nw: "nwse-resize",
    ne: "nesw-resize",
    se: "nwse-resize",
    sw: "nesw-resize"
};
var flipX = {
    e: "w",
    w: "e",
    nw: "ne",
    ne: "nw",
    se: "sw",
    sw: "se"
};
var flipY = {
    n: "s",
    s: "n",
    nw: "sw",
    ne: "se",
    se: "ne",
    sw: "nw"
};
var signsX = {
    overlay: +1,
    selection: +1,
    n: null,
    e: +1,
    s: null,
    w: -1,
    nw: -1,
    ne: +1,
    se: +1,
    sw: -1
};
var signsY = {
    overlay: +1,
    selection: +1,
    n: -1,
    e: null,
    s: +1,
    w: null,
    nw: -1,
    ne: -1,
    se: +1,
    sw: +1
};
function type(t) {
    return {
        type: t
    };
}
// Ignore right-click, since that should open the context menu.
function defaultFilter(event) {
    return !event.ctrlKey && !event.button;
}
function defaultExtent() {
    var svg = this.ownerSVGElement || this;
    if (svg.hasAttribute("viewBox")) {
        svg = svg.viewBox.baseVal;
        return [
            [
                svg.x,
                svg.y
            ],
            [
                svg.x + svg.width,
                svg.y + svg.height
            ]
        ];
    }
    return [
        [
            0,
            0
        ],
        [
            svg.width.baseVal.value,
            svg.height.baseVal.value
        ]
    ];
}
function defaultTouchable() {
    return navigator.maxTouchPoints || "ontouchstart" in this;
}
// Like d3.local, but with the name “__brush” rather than auto-generated.
function local(node) {
    while(!node.__brush)if (!(node = node.parentNode)) return;
    return node.__brush;
}
function empty(extent) {
    return extent[0][0] === extent[1][0] || extent[0][1] === extent[1][1];
}
function brushSelection(node) {
    var state = node.__brush;
    return state ? state.dim.output(state.selection) : null;
}
function brushX() {
    return brush(X);
}
function brushY() {
    return brush(Y);
}
function __TURBOPACK__default__export__() {
    return brush(XY);
}
function brush(dim) {
    var extent = defaultExtent, filter = defaultFilter, touchable = defaultTouchable, keys = true, listeners = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$dispatch$2f$src$2f$dispatch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__dispatch$3e$__["dispatch"])("start", "brush", "end"), handleSize = 6, touchending;
    function brush(group) {
        var overlay = group.property("__brush", initialize).selectAll(".overlay").data([
            type("overlay")
        ]);
        overlay.enter().append("rect").attr("class", "overlay").attr("pointer-events", "all").attr("cursor", cursors.overlay).merge(overlay).each(function() {
            var extent = local(this).extent;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(this).attr("x", extent[0][0]).attr("y", extent[0][1]).attr("width", extent[1][0] - extent[0][0]).attr("height", extent[1][1] - extent[0][1]);
        });
        group.selectAll(".selection").data([
            type("selection")
        ]).enter().append("rect").attr("class", "selection").attr("cursor", cursors.selection).attr("fill", "#777").attr("fill-opacity", 0.3).attr("stroke", "#fff").attr("shape-rendering", "crispEdges");
        var handle = group.selectAll(".handle").data(dim.handles, function(d) {
            return d.type;
        });
        handle.exit().remove();
        handle.enter().append("rect").attr("class", function(d) {
            return "handle handle--" + d.type;
        }).attr("cursor", function(d) {
            return cursors[d.type];
        });
        group.each(redraw).attr("fill", "none").attr("pointer-events", "all").on("mousedown.brush", started).filter(touchable).on("touchstart.brush", started).on("touchmove.brush", touchmoved).on("touchend.brush touchcancel.brush", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
    }
    brush.move = function(group, selection, event) {
        if (group.tween) {
            group.on("start.brush", function(event) {
                emitter(this, arguments).beforestart().start(event);
            }).on("interrupt.brush end.brush", function(event) {
                emitter(this, arguments).end(event);
            }).tween("brush", function() {
                var that = this, state = that.__brush, emit = emitter(that, arguments), selection0 = state.selection, selection1 = dim.input(typeof selection === "function" ? selection.apply(this, arguments) : selection, state.extent), i = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$value$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interpolate$3e$__["interpolate"])(selection0, selection1);
                function tween(t) {
                    state.selection = t === 1 && selection1 === null ? null : i(t);
                    redraw.call(that);
                    emit.brush();
                }
                return selection0 !== null && selection1 !== null ? tween : tween(1);
            });
        } else {
            group.each(function() {
                var that = this, args = arguments, state = that.__brush, selection1 = dim.input(typeof selection === "function" ? selection.apply(that, args) : selection, state.extent), emit = emitter(that, args).beforestart();
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interrupt$3e$__["interrupt"])(that);
                state.selection = selection1 === null ? null : selection1;
                redraw.call(that);
                emit.start(event).brush(event).end(event);
            });
        }
    };
    brush.clear = function(group, event) {
        brush.move(group, null, event);
    };
    function redraw() {
        var group = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(this), selection = local(this).selection;
        if (selection) {
            group.selectAll(".selection").style("display", null).attr("x", selection[0][0]).attr("y", selection[0][1]).attr("width", selection[1][0] - selection[0][0]).attr("height", selection[1][1] - selection[0][1]);
            group.selectAll(".handle").style("display", null).attr("x", function(d) {
                return d.type[d.type.length - 1] === "e" ? selection[1][0] - handleSize / 2 : selection[0][0] - handleSize / 2;
            }).attr("y", function(d) {
                return d.type[0] === "s" ? selection[1][1] - handleSize / 2 : selection[0][1] - handleSize / 2;
            }).attr("width", function(d) {
                return d.type === "n" || d.type === "s" ? selection[1][0] - selection[0][0] + handleSize : handleSize;
            }).attr("height", function(d) {
                return d.type === "e" || d.type === "w" ? selection[1][1] - selection[0][1] + handleSize : handleSize;
            });
        } else {
            group.selectAll(".selection,.handle").style("display", "none").attr("x", null).attr("y", null).attr("width", null).attr("height", null);
        }
    }
    function emitter(that, args, clean) {
        var emit = that.__brush.emitter;
        return emit && (!clean || !emit.clean) ? emit : new Emitter(that, args, clean);
    }
    function Emitter(that, args, clean) {
        this.that = that;
        this.args = args;
        this.state = that.__brush;
        this.active = 0;
        this.clean = clean;
    }
    Emitter.prototype = {
        beforestart: function() {
            if (++this.active === 1) this.state.emitter = this, this.starting = true;
            return this;
        },
        start: function(event, mode) {
            if (this.starting) this.starting = false, this.emit("start", event, mode);
            else this.emit("brush", event);
            return this;
        },
        brush: function(event, mode) {
            this.emit("brush", event, mode);
            return this;
        },
        end: function(event, mode) {
            if (--this.active === 0) delete this.state.emitter, this.emit("end", event, mode);
            return this;
        },
        emit: function(type, event, mode) {
            var d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(this.that).datum();
            listeners.call(type, this.that, new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$event$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](type, {
                sourceEvent: event,
                target: brush,
                selection: dim.output(this.state.selection),
                mode,
                dispatch: listeners
            }), d);
        }
    };
    function started(event) {
        if (touchending && !event.touches) return;
        if (!filter.apply(this, arguments)) return;
        var that = this, type = event.target.__data__.type, mode = (keys && event.metaKey ? type = "overlay" : type) === "selection" ? MODE_DRAG : keys && event.altKey ? MODE_CENTER : MODE_HANDLE, signX = dim === Y ? null : signsX[type], signY = dim === X ? null : signsY[type], state = local(that), extent = state.extent, selection = state.selection, W = extent[0][0], w0, w1, N = extent[0][1], n0, n1, E = extent[1][0], e0, e1, S = extent[1][1], s0, s1, dx = 0, dy = 0, moving, shifting = signX && signY && keys && event.shiftKey, lockX, lockY, points = Array.from(event.touches || [
            event
        ], (t)=>{
            const i = t.identifier;
            t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__pointer$3e$__["pointer"])(t, that);
            t.point0 = t.slice();
            t.identifier = i;
            return t;
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interrupt$3e$__["interrupt"])(that);
        var emit = emitter(that, arguments, true).beforestart();
        if (type === "overlay") {
            if (selection) moving = true;
            const pts = [
                points[0],
                points[1] || points[0]
            ];
            state.selection = selection = [
                [
                    w0 = dim === Y ? W : min(pts[0][0], pts[1][0]),
                    n0 = dim === X ? N : min(pts[0][1], pts[1][1])
                ],
                [
                    e0 = dim === Y ? E : max(pts[0][0], pts[1][0]),
                    s0 = dim === X ? S : max(pts[0][1], pts[1][1])
                ]
            ];
            if (points.length > 1) move(event);
        } else {
            w0 = selection[0][0];
            n0 = selection[0][1];
            e0 = selection[1][0];
            s0 = selection[1][1];
        }
        w1 = w0;
        n1 = n0;
        e1 = e0;
        s1 = s0;
        var group = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(that).attr("pointer-events", "none");
        var overlay = group.selectAll(".overlay").attr("cursor", cursors[type]);
        if (event.touches) {
            emit.moved = moved;
            emit.ended = ended;
        } else {
            var view = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(event.view).on("mousemove.brush", moved, true).on("mouseup.brush", ended, true);
            if (keys) view.on("keydown.brush", keydowned, true).on("keyup.brush", keyupped, true);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$nodrag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__dragDisable$3e$__["dragDisable"])(event.view);
        }
        redraw.call(that);
        emit.start(event, mode.name);
        function moved(event) {
            for (const p of event.changedTouches || [
                event
            ]){
                for (const d of points)if (d.identifier === p.identifier) d.cur = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__pointer$3e$__["pointer"])(p, that);
            }
            if (shifting && !lockX && !lockY && points.length === 1) {
                const point = points[0];
                if (abs(point.cur[0] - point[0]) > abs(point.cur[1] - point[1])) lockY = true;
                else lockX = true;
            }
            for (const point of points)if (point.cur) point[0] = point.cur[0], point[1] = point.cur[1];
            moving = true;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(event);
            move(event);
        }
        function move(event) {
            const point = points[0], point0 = point.point0;
            var t;
            dx = point[0] - point0[0];
            dy = point[1] - point0[1];
            switch(mode){
                case MODE_SPACE:
                case MODE_DRAG:
                    {
                        if (signX) dx = max(W - w0, min(E - e0, dx)), w1 = w0 + dx, e1 = e0 + dx;
                        if (signY) dy = max(N - n0, min(S - s0, dy)), n1 = n0 + dy, s1 = s0 + dy;
                        break;
                    }
                case MODE_HANDLE:
                    {
                        if (points[1]) {
                            if (signX) w1 = max(W, min(E, points[0][0])), e1 = max(W, min(E, points[1][0])), signX = 1;
                            if (signY) n1 = max(N, min(S, points[0][1])), s1 = max(N, min(S, points[1][1])), signY = 1;
                        } else {
                            if (signX < 0) dx = max(W - w0, min(E - w0, dx)), w1 = w0 + dx, e1 = e0;
                            else if (signX > 0) dx = max(W - e0, min(E - e0, dx)), w1 = w0, e1 = e0 + dx;
                            if (signY < 0) dy = max(N - n0, min(S - n0, dy)), n1 = n0 + dy, s1 = s0;
                            else if (signY > 0) dy = max(N - s0, min(S - s0, dy)), n1 = n0, s1 = s0 + dy;
                        }
                        break;
                    }
                case MODE_CENTER:
                    {
                        if (signX) w1 = max(W, min(E, w0 - dx * signX)), e1 = max(W, min(E, e0 + dx * signX));
                        if (signY) n1 = max(N, min(S, n0 - dy * signY)), s1 = max(N, min(S, s0 + dy * signY));
                        break;
                    }
            }
            if (e1 < w1) {
                signX *= -1;
                t = w0, w0 = e0, e0 = t;
                t = w1, w1 = e1, e1 = t;
                if (type in flipX) overlay.attr("cursor", cursors[type = flipX[type]]);
            }
            if (s1 < n1) {
                signY *= -1;
                t = n0, n0 = s0, s0 = t;
                t = n1, n1 = s1, s1 = t;
                if (type in flipY) overlay.attr("cursor", cursors[type = flipY[type]]);
            }
            if (state.selection) selection = state.selection; // May be set by brush.move!
            if (lockX) w1 = selection[0][0], e1 = selection[1][0];
            if (lockY) n1 = selection[0][1], s1 = selection[1][1];
            if (selection[0][0] !== w1 || selection[0][1] !== n1 || selection[1][0] !== e1 || selection[1][1] !== s1) {
                state.selection = [
                    [
                        w1,
                        n1
                    ],
                    [
                        e1,
                        s1
                    ]
                ];
                redraw.call(that);
                emit.brush(event, mode.name);
            }
        }
        function ended(event) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nopropagation"])(event);
            if (event.touches) {
                if (event.touches.length) return;
                if (touchending) clearTimeout(touchending);
                touchending = setTimeout(function() {
                    touchending = null;
                }, 500); // Ghost clicks are delayed!
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$nodrag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__yesdrag__as__dragEnable$3e$__["dragEnable"])(event.view, moving);
                view.on("keydown.brush keyup.brush mousemove.brush mouseup.brush", null);
            }
            group.attr("pointer-events", "all");
            overlay.attr("cursor", cursors.overlay);
            if (state.selection) selection = state.selection; // May be set by brush.move (on start)!
            if (empty(selection)) state.selection = null, redraw.call(that);
            emit.end(event, mode.name);
        }
        function keydowned(event) {
            switch(event.keyCode){
                case 16:
                    {
                        shifting = signX && signY;
                        break;
                    }
                case 18:
                    {
                        if (mode === MODE_HANDLE) {
                            if (signX) e0 = e1 - dx * signX, w0 = w1 + dx * signX;
                            if (signY) s0 = s1 - dy * signY, n0 = n1 + dy * signY;
                            mode = MODE_CENTER;
                            move(event);
                        }
                        break;
                    }
                case 32:
                    {
                        if (mode === MODE_HANDLE || mode === MODE_CENTER) {
                            if (signX < 0) e0 = e1 - dx;
                            else if (signX > 0) w0 = w1 - dx;
                            if (signY < 0) s0 = s1 - dy;
                            else if (signY > 0) n0 = n1 - dy;
                            mode = MODE_SPACE;
                            overlay.attr("cursor", cursors.selection);
                            move(event);
                        }
                        break;
                    }
                default:
                    return;
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(event);
        }
        function keyupped(event) {
            switch(event.keyCode){
                case 16:
                    {
                        if (shifting) {
                            lockX = lockY = shifting = false;
                            move(event);
                        }
                        break;
                    }
                case 18:
                    {
                        if (mode === MODE_CENTER) {
                            if (signX < 0) e0 = e1;
                            else if (signX > 0) w0 = w1;
                            if (signY < 0) s0 = s1;
                            else if (signY > 0) n0 = n1;
                            mode = MODE_HANDLE;
                            move(event);
                        }
                        break;
                    }
                case 32:
                    {
                        if (mode === MODE_SPACE) {
                            if (event.altKey) {
                                if (signX) e0 = e1 - dx * signX, w0 = w1 + dx * signX;
                                if (signY) s0 = s1 - dy * signY, n0 = n1 + dy * signY;
                                mode = MODE_CENTER;
                            } else {
                                if (signX < 0) e0 = e1;
                                else if (signX > 0) w0 = w1;
                                if (signY < 0) s0 = s1;
                                else if (signY > 0) n0 = n1;
                                mode = MODE_HANDLE;
                            }
                            overlay.attr("cursor", cursors[type]);
                            move(event);
                        }
                        break;
                    }
                default:
                    return;
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(event);
        }
    }
    function touchmoved(event) {
        emitter(this, arguments).moved(event);
    }
    function touchended(event) {
        emitter(this, arguments).ended(event);
    }
    function initialize() {
        var state = this.__brush || {
            selection: null
        };
        state.extent = number2(extent.apply(this, arguments));
        state.dim = dim;
        return state;
    }
    brush.extent = function(_) {
        return arguments.length ? (extent = typeof _ === "function" ? _ : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(number2(_)), brush) : extent;
    };
    brush.filter = function(_) {
        return arguments.length ? (filter = typeof _ === "function" ? _ : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(!!_), brush) : filter;
    };
    brush.touchable = function(_) {
        return arguments.length ? (touchable = typeof _ === "function" ? _ : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(!!_), brush) : touchable;
    };
    brush.handleSize = function(_) {
        return arguments.length ? (handleSize = +_, brush) : handleSize;
    };
    brush.keyModifiers = function(_) {
        return arguments.length ? (keys = !!_, brush) : keys;
    };
    brush.on = function() {
        var value = listeners.on.apply(listeners, arguments);
        return value === listeners ? brush : value;
    };
    return brush;
}
}),
"[project]/frontend/node_modules/d3-brush/src/constant.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = (x)=>()=>x;
}),
"[project]/frontend/node_modules/d3-brush/src/event.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BrushEvent
]);
function BrushEvent(type, { sourceEvent, target, selection, mode, dispatch }) {
    Object.defineProperties(this, {
        type: {
            value: type,
            enumerable: true,
            configurable: true
        },
        sourceEvent: {
            value: sourceEvent,
            enumerable: true,
            configurable: true
        },
        target: {
            value: target,
            enumerable: true,
            configurable: true
        },
        selection: {
            value: selection,
            enumerable: true,
            configurable: true
        },
        mode: {
            value: mode,
            enumerable: true,
            configurable: true
        },
        _: {
            value: dispatch
        }
    });
}
}),
"[project]/frontend/node_modules/d3-brush/src/index.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$brush$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-brush/src/brush.js [app-client] (ecmascript)");
;
}),
"[project]/frontend/node_modules/d3-brush/src/noevent.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "nopropagation",
    ()=>nopropagation
]);
function nopropagation(event) {
    event.stopImmediatePropagation();
}
function __TURBOPACK__default__export__(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
}
}),
"[project]/frontend/node_modules/d3-color/src/color.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Color",
    ()=>Color,
    "Rgb",
    ()=>Rgb,
    "brighter",
    ()=>brighter,
    "darker",
    ()=>darker,
    "default",
    ()=>color,
    "hsl",
    ()=>hsl,
    "hslConvert",
    ()=>hslConvert,
    "rgb",
    ()=>rgb,
    "rgbConvert",
    ()=>rgbConvert
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$define$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-color/src/define.js [app-client] (ecmascript)");
;
function Color() {}
var darker = 0.7;
var brighter = 1 / darker;
var reI = "\\s*([+-]?\\d+)\\s*", reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", reHex = /^#([0-9a-f]{3,8})$/, reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`), reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`), reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`), reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`), reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`), reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);
var named = {
    aliceblue: 0xf0f8ff,
    antiquewhite: 0xfaebd7,
    aqua: 0x00ffff,
    aquamarine: 0x7fffd4,
    azure: 0xf0ffff,
    beige: 0xf5f5dc,
    bisque: 0xffe4c4,
    black: 0x000000,
    blanchedalmond: 0xffebcd,
    blue: 0x0000ff,
    blueviolet: 0x8a2be2,
    brown: 0xa52a2a,
    burlywood: 0xdeb887,
    cadetblue: 0x5f9ea0,
    chartreuse: 0x7fff00,
    chocolate: 0xd2691e,
    coral: 0xff7f50,
    cornflowerblue: 0x6495ed,
    cornsilk: 0xfff8dc,
    crimson: 0xdc143c,
    cyan: 0x00ffff,
    darkblue: 0x00008b,
    darkcyan: 0x008b8b,
    darkgoldenrod: 0xb8860b,
    darkgray: 0xa9a9a9,
    darkgreen: 0x006400,
    darkgrey: 0xa9a9a9,
    darkkhaki: 0xbdb76b,
    darkmagenta: 0x8b008b,
    darkolivegreen: 0x556b2f,
    darkorange: 0xff8c00,
    darkorchid: 0x9932cc,
    darkred: 0x8b0000,
    darksalmon: 0xe9967a,
    darkseagreen: 0x8fbc8f,
    darkslateblue: 0x483d8b,
    darkslategray: 0x2f4f4f,
    darkslategrey: 0x2f4f4f,
    darkturquoise: 0x00ced1,
    darkviolet: 0x9400d3,
    deeppink: 0xff1493,
    deepskyblue: 0x00bfff,
    dimgray: 0x696969,
    dimgrey: 0x696969,
    dodgerblue: 0x1e90ff,
    firebrick: 0xb22222,
    floralwhite: 0xfffaf0,
    forestgreen: 0x228b22,
    fuchsia: 0xff00ff,
    gainsboro: 0xdcdcdc,
    ghostwhite: 0xf8f8ff,
    gold: 0xffd700,
    goldenrod: 0xdaa520,
    gray: 0x808080,
    green: 0x008000,
    greenyellow: 0xadff2f,
    grey: 0x808080,
    honeydew: 0xf0fff0,
    hotpink: 0xff69b4,
    indianred: 0xcd5c5c,
    indigo: 0x4b0082,
    ivory: 0xfffff0,
    khaki: 0xf0e68c,
    lavender: 0xe6e6fa,
    lavenderblush: 0xfff0f5,
    lawngreen: 0x7cfc00,
    lemonchiffon: 0xfffacd,
    lightblue: 0xadd8e6,
    lightcoral: 0xf08080,
    lightcyan: 0xe0ffff,
    lightgoldenrodyellow: 0xfafad2,
    lightgray: 0xd3d3d3,
    lightgreen: 0x90ee90,
    lightgrey: 0xd3d3d3,
    lightpink: 0xffb6c1,
    lightsalmon: 0xffa07a,
    lightseagreen: 0x20b2aa,
    lightskyblue: 0x87cefa,
    lightslategray: 0x778899,
    lightslategrey: 0x778899,
    lightsteelblue: 0xb0c4de,
    lightyellow: 0xffffe0,
    lime: 0x00ff00,
    limegreen: 0x32cd32,
    linen: 0xfaf0e6,
    magenta: 0xff00ff,
    maroon: 0x800000,
    mediumaquamarine: 0x66cdaa,
    mediumblue: 0x0000cd,
    mediumorchid: 0xba55d3,
    mediumpurple: 0x9370db,
    mediumseagreen: 0x3cb371,
    mediumslateblue: 0x7b68ee,
    mediumspringgreen: 0x00fa9a,
    mediumturquoise: 0x48d1cc,
    mediumvioletred: 0xc71585,
    midnightblue: 0x191970,
    mintcream: 0xf5fffa,
    mistyrose: 0xffe4e1,
    moccasin: 0xffe4b5,
    navajowhite: 0xffdead,
    navy: 0x000080,
    oldlace: 0xfdf5e6,
    olive: 0x808000,
    olivedrab: 0x6b8e23,
    orange: 0xffa500,
    orangered: 0xff4500,
    orchid: 0xda70d6,
    palegoldenrod: 0xeee8aa,
    palegreen: 0x98fb98,
    paleturquoise: 0xafeeee,
    palevioletred: 0xdb7093,
    papayawhip: 0xffefd5,
    peachpuff: 0xffdab9,
    peru: 0xcd853f,
    pink: 0xffc0cb,
    plum: 0xdda0dd,
    powderblue: 0xb0e0e6,
    purple: 0x800080,
    rebeccapurple: 0x663399,
    red: 0xff0000,
    rosybrown: 0xbc8f8f,
    royalblue: 0x4169e1,
    saddlebrown: 0x8b4513,
    salmon: 0xfa8072,
    sandybrown: 0xf4a460,
    seagreen: 0x2e8b57,
    seashell: 0xfff5ee,
    sienna: 0xa0522d,
    silver: 0xc0c0c0,
    skyblue: 0x87ceeb,
    slateblue: 0x6a5acd,
    slategray: 0x708090,
    slategrey: 0x708090,
    snow: 0xfffafa,
    springgreen: 0x00ff7f,
    steelblue: 0x4682b4,
    tan: 0xd2b48c,
    teal: 0x008080,
    thistle: 0xd8bfd8,
    tomato: 0xff6347,
    turquoise: 0x40e0d0,
    violet: 0xee82ee,
    wheat: 0xf5deb3,
    white: 0xffffff,
    whitesmoke: 0xf5f5f5,
    yellow: 0xffff00,
    yellowgreen: 0x9acd32
};
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$define$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(Color, color, {
    copy (channels) {
        return Object.assign(new this.constructor, this, channels);
    },
    displayable () {
        return this.rgb().displayable();
    },
    hex: color_formatHex,
    formatHex: color_formatHex,
    formatHex8: color_formatHex8,
    formatHsl: color_formatHsl,
    formatRgb: color_formatRgb,
    toString: color_formatRgb
});
function color_formatHex() {
    return this.rgb().formatHex();
}
function color_formatHex8() {
    return this.rgb().formatHex8();
}
function color_formatHsl() {
    return hslConvert(this).formatHsl();
}
function color_formatRgb() {
    return this.rgb().formatRgb();
}
function color(format) {
    var m, l;
    format = (format + "").trim().toLowerCase();
    return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
     : l === 3 ? new Rgb(m >> 8 & 0xf | m >> 4 & 0xf0, m >> 4 & 0xf | m & 0xf0, (m & 0xf) << 4 | m & 0xf, 1) // #f00
     : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
     : l === 4 ? rgba(m >> 12 & 0xf | m >> 8 & 0xf0, m >> 8 & 0xf | m >> 4 & 0xf0, m >> 4 & 0xf | m & 0xf0, ((m & 0xf) << 4 | m & 0xf) / 0xff) // #f000
     : null) // invalid hex
     : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
     : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
     : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
     : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
     : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
     : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
     : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
     : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
function rgbn(n) {
    return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}
function rgba(r, g, b, a) {
    if (a <= 0) r = g = b = NaN;
    return new Rgb(r, g, b, a);
}
function rgbConvert(o) {
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Rgb;
    o = o.rgb();
    return new Rgb(o.r, o.g, o.b, o.opacity);
}
function rgb(r, g, b, opacity) {
    return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}
function Rgb(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$define$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(Rgb, rgb, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$define$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])(Color, {
    brighter (k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker (k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb () {
        return this;
    },
    clamp () {
        return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
    },
    displayable () {
        return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
    },
    hex: rgb_formatHex,
    formatHex: rgb_formatHex,
    formatHex8: rgb_formatHex8,
    formatRgb: rgb_formatRgb,
    toString: rgb_formatRgb
}));
function rgb_formatHex() {
    return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
}
function rgb_formatHex8() {
    return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function rgb_formatRgb() {
    const a = clampa(this.opacity);
    return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
}
function clampa(opacity) {
    return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
}
function clampi(value) {
    return Math.max(0, Math.min(255, Math.round(value) || 0));
}
function hex(value) {
    value = clampi(value);
    return (value < 16 ? "0" : "") + value.toString(16);
}
function hsla(h, s, l, a) {
    if (a <= 0) h = s = l = NaN;
    else if (l <= 0 || l >= 1) h = s = NaN;
    else if (s <= 0) h = NaN;
    return new Hsl(h, s, l, a);
}
function hslConvert(o) {
    if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Hsl;
    if (o instanceof Hsl) return o;
    o = o.rgb();
    var r = o.r / 255, g = o.g / 255, b = o.b / 255, min = Math.min(r, g, b), max = Math.max(r, g, b), h = NaN, s = max - min, l = (max + min) / 2;
    if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
    } else {
        s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl(h, s, l, o.opacity);
}
function hsl(h, s, l, opacity) {
    return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}
function Hsl(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$define$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(Hsl, hsl, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$define$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])(Color, {
    brighter (k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    darker (k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    rgb () {
        var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < 0.5 ? l : 1 - l) * s, m1 = 2 * l - m2;
        return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
    },
    clamp () {
        return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
    },
    displayable () {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
    },
    formatHsl () {
        const a = clampa(this.opacity);
        return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
    }
}));
function clamph(value) {
    value = (value || 0) % 360;
    return value < 0 ? value + 360 : value;
}
function clampt(value) {
    return Math.max(0, Math.min(1, value || 0));
}
/* From FvD 13.37, CSS Color Module Level 3 */ function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}
}),
"[project]/frontend/node_modules/d3-color/src/color.js [app-client] (ecmascript) <export default as color>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "color",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-color/src/color.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-color/src/define.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "extend",
    ()=>extend
]);
function __TURBOPACK__default__export__(constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
}
function extend(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for(var key in definition)prototype[key] = definition[key];
    return prototype;
}
}),
"[project]/frontend/node_modules/d3-dispatch/src/dispatch.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var noop = {
    value: ()=>{}
};
function dispatch() {
    for(var i = 0, n = arguments.length, _ = {}, t; i < n; ++i){
        if (!(t = arguments[i] + "") || t in _ || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
        _[t] = [];
    }
    return new Dispatch(_);
}
function Dispatch(_) {
    this._ = _;
}
function parseTypenames(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
        return {
            type: t,
            name: name
        };
    });
}
Dispatch.prototype = dispatch.prototype = {
    constructor: Dispatch,
    on: function(typename, callback) {
        var _ = this._, T = parseTypenames(typename + "", _), t, i = -1, n = T.length;
        // If no callback was specified, return the callback of the given type and name.
        if (arguments.length < 2) {
            while(++i < n)if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
            return;
        }
        // If a type was specified, set the callback for the given type and name.
        // Otherwise, if a null callback was specified, remove callbacks of the given name.
        if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
        while(++i < n){
            if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
            else if (callback == null) for(t in _)_[t] = set(_[t], typename.name, null);
        }
        return this;
    },
    copy: function() {
        var copy = {}, _ = this._;
        for(var t in _)copy[t] = _[t].slice();
        return new Dispatch(copy);
    },
    call: function(type, that) {
        if ((n = arguments.length - 2) > 0) for(var args = new Array(n), i = 0, n, t; i < n; ++i)args[i] = arguments[i + 2];
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for(t = this._[type], i = 0, n = t.length; i < n; ++i)t[i].value.apply(that, args);
    },
    apply: function(type, that, args) {
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for(var t = this._[type], i = 0, n = t.length; i < n; ++i)t[i].value.apply(that, args);
    }
};
function get(type, name) {
    for(var i = 0, n = type.length, c; i < n; ++i){
        if ((c = type[i]).name === name) {
            return c.value;
        }
    }
}
function set(type, name, callback) {
    for(var i = 0, n = type.length; i < n; ++i){
        if (type[i].name === name) {
            type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
            break;
        }
    }
    if (callback != null) type.push({
        name: name,
        value: callback
    });
    return type;
}
const __TURBOPACK__default__export__ = dispatch;
}),
"[project]/frontend/node_modules/d3-dispatch/src/dispatch.js [app-client] (ecmascript) <export default as dispatch>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dispatch",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$dispatch$2f$src$2f$dispatch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$dispatch$2f$src$2f$dispatch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-dispatch/src/dispatch.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-drag/src/nodrag.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "yesdrag",
    ()=>yesdrag
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/select.js [app-client] (ecmascript) <export default as select>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-drag/src/noevent.js [app-client] (ecmascript)");
;
;
function __TURBOPACK__default__export__(view) {
    var root = view.document.documentElement, selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(view).on("dragstart.drag", __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nonpassivecapture"]);
    if ("onselectstart" in root) {
        selection.on("selectstart.drag", __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nonpassivecapture"]);
    } else {
        root.__noselect = root.style.MozUserSelect;
        root.style.MozUserSelect = "none";
    }
}
function yesdrag(view, noclick) {
    var root = view.document.documentElement, selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(view).on("dragstart.drag", null);
    if (noclick) {
        selection.on("click.drag", __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nonpassivecapture"]);
        setTimeout(function() {
            selection.on("click.drag", null);
        }, 0);
    }
    if ("onselectstart" in root) {
        selection.on("selectstart.drag", null);
    } else {
        root.style.MozUserSelect = root.__noselect;
        delete root.__noselect;
    }
}
}),
"[project]/frontend/node_modules/d3-drag/src/nodrag.js [app-client] (ecmascript) <export default as dragDisable>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dragDisable",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$nodrag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$nodrag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-drag/src/nodrag.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-drag/src/nodrag.js [app-client] (ecmascript) <export yesdrag as dragEnable>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dragEnable",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$nodrag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["yesdrag"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$nodrag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-drag/src/nodrag.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-drag/src/noevent.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// These are typically used in conjunction with noevent to ensure that we can
// preventDefault on the event.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "nonpassive",
    ()=>nonpassive,
    "nonpassivecapture",
    ()=>nonpassivecapture,
    "nopropagation",
    ()=>nopropagation
]);
const nonpassive = {
    passive: false
};
const nonpassivecapture = {
    capture: true,
    passive: false
};
function nopropagation(event) {
    event.stopImmediatePropagation();
}
function __TURBOPACK__default__export__(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
}
}),
"[project]/frontend/node_modules/d3-ease/src/cubic.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cubicIn",
    ()=>cubicIn,
    "cubicInOut",
    ()=>cubicInOut,
    "cubicOut",
    ()=>cubicOut
]);
function cubicIn(t) {
    return t * t * t;
}
function cubicOut(t) {
    return --t * t * t + 1;
}
function cubicInOut(t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
}),
"[project]/frontend/node_modules/d3-ease/src/cubic.js [app-client] (ecmascript) <export cubicInOut as easeCubicInOut>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "easeCubicInOut",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$ease$2f$src$2f$cubic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cubicInOut"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$ease$2f$src$2f$cubic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-ease/src/cubic.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-interpolate/src/array.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "genericArray",
    ()=>genericArray
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$value$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/value.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$numberArray$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/numberArray.js [app-client] (ecmascript)");
;
;
function __TURBOPACK__default__export__(a, b) {
    return ((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$numberArray$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumberArray"])(b) ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$numberArray$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] : genericArray)(a, b);
}
function genericArray(a, b) {
    var nb = b ? b.length : 0, na = a ? Math.min(nb, a.length) : 0, x = new Array(na), c = new Array(nb), i;
    for(i = 0; i < na; ++i)x[i] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$value$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(a[i], b[i]);
    for(; i < nb; ++i)c[i] = b[i];
    return function(t) {
        for(i = 0; i < na; ++i)c[i] = x[i](t);
        return c;
    };
}
}),
"[project]/frontend/node_modules/d3-interpolate/src/basis.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "basis",
    ()=>basis,
    "default",
    ()=>__TURBOPACK__default__export__
]);
function basis(t1, v0, v1, v2, v3) {
    var t2 = t1 * t1, t3 = t2 * t1;
    return ((1 - 3 * t1 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
}
function __TURBOPACK__default__export__(values) {
    var n = values.length - 1;
    return function(t) {
        var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n), v1 = values[i], v2 = values[i + 1], v0 = i > 0 ? values[i - 1] : 2 * v1 - v2, v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
        return basis((t - i / n) * n, v0, v1, v2, v3);
    };
}
}),
"[project]/frontend/node_modules/d3-interpolate/src/basisClosed.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$basis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/basis.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(values) {
    var n = values.length;
    return function(t) {
        var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n), v0 = values[(i + n - 1) % n], v1 = values[i % n], v2 = values[(i + 1) % n], v3 = values[(i + 2) % n];
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$basis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["basis"])((t - i / n) * n, v0, v1, v2, v3);
    };
}
}),
"[project]/frontend/node_modules/d3-interpolate/src/color.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>nogamma,
    "gamma",
    ()=>gamma,
    "hue",
    ()=>hue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/constant.js [app-client] (ecmascript)");
;
function linear(a, d) {
    return function(t) {
        return a + t * d;
    };
}
function exponential(a, b, y) {
    return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
        return Math.pow(a + t * b, y);
    };
}
function hue(a, b) {
    var d = b - a;
    return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(isNaN(a) ? b : a);
}
function gamma(y) {
    return (y = +y) === 1 ? nogamma : function(a, b) {
        return b - a ? exponential(a, b, y) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(isNaN(a) ? b : a);
    };
}
function nogamma(a, b) {
    var d = b - a;
    return d ? linear(a, d) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(isNaN(a) ? b : a);
}
}),
"[project]/frontend/node_modules/d3-interpolate/src/constant.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = (x)=>()=>x;
}),
"[project]/frontend/node_modules/d3-interpolate/src/date.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(a, b) {
    var d = new Date;
    return a = +a, b = +b, function(t) {
        return d.setTime(a * (1 - t) + b * t), d;
    };
}
}),
"[project]/frontend/node_modules/d3-interpolate/src/number.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(a, b) {
    return a = +a, b = +b, function(t) {
        return a * (1 - t) + b * t;
    };
}
}),
"[project]/frontend/node_modules/d3-interpolate/src/number.js [app-client] (ecmascript) <export default as interpolateNumber>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "interpolateNumber",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/number.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-interpolate/src/numberArray.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "isNumberArray",
    ()=>isNumberArray
]);
function __TURBOPACK__default__export__(a, b) {
    if (!b) b = [];
    var n = a ? Math.min(b.length, a.length) : 0, c = b.slice(), i;
    return function(t) {
        for(i = 0; i < n; ++i)c[i] = a[i] * (1 - t) + b[i] * t;
        return c;
    };
}
function isNumberArray(x) {
    return ArrayBuffer.isView(x) && !(x instanceof DataView);
}
}),
"[project]/frontend/node_modules/d3-interpolate/src/object.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$value$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/value.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(a, b) {
    var i = {}, c = {}, k;
    if (a === null || typeof a !== "object") a = {};
    if (b === null || typeof b !== "object") b = {};
    for(k in b){
        if (k in a) {
            i[k] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$value$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(a[k], b[k]);
        } else {
            c[k] = b[k];
        }
    }
    return function(t) {
        for(k in i)c[k] = i[k](t);
        return c;
    };
}
}),
"[project]/frontend/node_modules/d3-interpolate/src/rgb.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "rgbBasis",
    ()=>rgbBasis,
    "rgbBasisClosed",
    ()=>rgbBasisClosed
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-color/src/color.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$basis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/basis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$basisClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/basisClosed.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/color.js [app-client] (ecmascript)");
;
;
;
;
const __TURBOPACK__default__export__ = function rgbGamma(y) {
    var color = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["gamma"])(y);
    function rgb(start, end) {
        var r = color((start = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rgb"])(start)).r, (end = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rgb"])(end)).r), g = color(start.g, end.g), b = color(start.b, end.b), opacity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(start.opacity, end.opacity);
        return function(t) {
            start.r = r(t);
            start.g = g(t);
            start.b = b(t);
            start.opacity = opacity(t);
            return start + "";
        };
    }
    rgb.gamma = rgbGamma;
    return rgb;
}(1);
function rgbSpline(spline) {
    return function(colors) {
        var n = colors.length, r = new Array(n), g = new Array(n), b = new Array(n), i, color;
        for(i = 0; i < n; ++i){
            color = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rgb"])(colors[i]);
            r[i] = color.r || 0;
            g[i] = color.g || 0;
            b[i] = color.b || 0;
        }
        r = spline(r);
        g = spline(g);
        b = spline(b);
        color.opacity = 1;
        return function(t) {
            color.r = r(t);
            color.g = g(t);
            color.b = b(t);
            return color + "";
        };
    };
}
var rgbBasis = rgbSpline(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$basis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
var rgbBasisClosed = rgbSpline(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$basisClosed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
}),
"[project]/frontend/node_modules/d3-interpolate/src/rgb.js [app-client] (ecmascript) <export default as interpolateRgb>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "interpolateRgb",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$rgb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$rgb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/rgb.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-interpolate/src/string.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/number.js [app-client] (ecmascript)");
;
var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, reB = new RegExp(reA.source, "g");
function zero(b) {
    return function() {
        return b;
    };
}
function one(b) {
    return function(t) {
        return b(t) + "";
    };
}
function __TURBOPACK__default__export__(a, b) {
    var bi = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = []; // number interpolators
    // Coerce inputs to strings.
    a = a + "", b = b + "";
    // Interpolate pairs of numbers in a & b.
    while((am = reA.exec(a)) && (bm = reB.exec(b))){
        if ((bs = bm.index) > bi) {
            bs = b.slice(bi, bs);
            if (s[i]) s[i] += bs; // coalesce with previous string
            else s[++i] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) {
            if (s[i]) s[i] += bm; // coalesce with previous string
            else s[++i] = bm;
        } else {
            s[++i] = null;
            q.push({
                i: i,
                x: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(am, bm)
            });
        }
        bi = reB.lastIndex;
    }
    // Add remains of b.
    if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
    }
    // Special optimization for only a single match.
    // Otherwise, interpolate each of the numbers and rejoin the string.
    return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function(t) {
        for(var i = 0, o; i < b; ++i)s[(o = q[i]).i] = o.x(t);
        return s.join("");
    });
}
}),
"[project]/frontend/node_modules/d3-interpolate/src/string.js [app-client] (ecmascript) <export default as interpolateString>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "interpolateString",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$string$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$string$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/string.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-interpolate/src/transform/decompose.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "identity",
    ()=>identity
]);
var degrees = 180 / Math.PI;
var identity = {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    skewX: 0,
    scaleX: 1,
    scaleY: 1
};
function __TURBOPACK__default__export__(a, b, c, d, e, f) {
    var scaleX, scaleY, skewX;
    if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
    if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
    if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
    if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
    return {
        translateX: e,
        translateY: f,
        rotate: Math.atan2(b, a) * degrees,
        skewX: Math.atan(skewX) * degrees,
        scaleX: scaleX,
        scaleY: scaleY
    };
}
}),
"[project]/frontend/node_modules/d3-interpolate/src/transform/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "interpolateTransformCss",
    ()=>interpolateTransformCss,
    "interpolateTransformSvg",
    ()=>interpolateTransformSvg
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/number.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$parse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/transform/parse.js [app-client] (ecmascript)");
;
;
function interpolateTransform(parse, pxComma, pxParen, degParen) {
    function pop(s) {
        return s.length ? s.pop() + " " : "";
    }
    function translate(xa, ya, xb, yb, s, q) {
        if (xa !== xb || ya !== yb) {
            var i = s.push("translate(", null, pxComma, null, pxParen);
            q.push({
                i: i - 4,
                x: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(xa, xb)
            }, {
                i: i - 2,
                x: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(ya, yb)
            });
        } else if (xb || yb) {
            s.push("translate(" + xb + pxComma + yb + pxParen);
        }
    }
    function rotate(a, b, s, q) {
        if (a !== b) {
            if (a - b > 180) b += 360;
            else if (b - a > 180) a += 360; // shortest path
            q.push({
                i: s.push(pop(s) + "rotate(", null, degParen) - 2,
                x: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(a, b)
            });
        } else if (b) {
            s.push(pop(s) + "rotate(" + b + degParen);
        }
    }
    function skewX(a, b, s, q) {
        if (a !== b) {
            q.push({
                i: s.push(pop(s) + "skewX(", null, degParen) - 2,
                x: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(a, b)
            });
        } else if (b) {
            s.push(pop(s) + "skewX(" + b + degParen);
        }
    }
    function scale(xa, ya, xb, yb, s, q) {
        if (xa !== xb || ya !== yb) {
            var i = s.push(pop(s) + "scale(", null, ",", null, ")");
            q.push({
                i: i - 4,
                x: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(xa, xb)
            }, {
                i: i - 2,
                x: (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(ya, yb)
            });
        } else if (xb !== 1 || yb !== 1) {
            s.push(pop(s) + "scale(" + xb + "," + yb + ")");
        }
    }
    return function(a, b) {
        var s = [], q = []; // number interpolators
        a = parse(a), b = parse(b);
        translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
        rotate(a.rotate, b.rotate, s, q);
        skewX(a.skewX, b.skewX, s, q);
        scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
        a = b = null; // gc
        return function(t) {
            var i = -1, n = q.length, o;
            while(++i < n)s[(o = q[i]).i] = o.x(t);
            return s.join("");
        };
    };
}
var interpolateTransformCss = interpolateTransform(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$parse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseCss"], "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$parse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseSvg"], ", ", ")", ")");
}),
"[project]/frontend/node_modules/d3-interpolate/src/transform/parse.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "parseCss",
    ()=>parseCss,
    "parseSvg",
    ()=>parseSvg
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$decompose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/transform/decompose.js [app-client] (ecmascript)");
;
var svgNode;
function parseCss(value) {
    const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
    return m.isIdentity ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$decompose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["identity"] : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$decompose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(m.a, m.b, m.c, m.d, m.e, m.f);
}
function parseSvg(value) {
    if (value == null) return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$decompose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["identity"];
    if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgNode.setAttribute("transform", value);
    if (!(value = svgNode.transform.baseVal.consolidate())) return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$decompose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["identity"];
    value = value.matrix;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$decompose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(value.a, value.b, value.c, value.d, value.e, value.f);
}
}),
"[project]/frontend/node_modules/d3-interpolate/src/value.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__color$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-color/src/color.js [app-client] (ecmascript) <export default as color>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$rgb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/rgb.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/array.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$date$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/date.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/number.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$object$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/object.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$string$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/string.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/constant.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$numberArray$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/numberArray.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
function __TURBOPACK__default__export__(a, b) {
    var t = typeof b, c;
    return b == null || t === "boolean" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(b) : (t === "number" ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] : t === "string" ? (c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__color$3e$__["color"])(b)) ? (b = c, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$rgb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]) : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$string$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] : b instanceof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__color$3e$__["color"] ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$rgb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] : b instanceof Date ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$date$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$numberArray$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumberArray"])(b) ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$numberArray$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] : Array.isArray(b) ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["genericArray"] : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$object$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(a, b);
}
}),
"[project]/frontend/node_modules/d3-interpolate/src/value.js [app-client] (ecmascript) <export default as interpolate>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "interpolate",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$value$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$value$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/value.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-interpolate/src/zoom.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var epsilon2 = 1e-12;
function cosh(x) {
    return ((x = Math.exp(x)) + 1 / x) / 2;
}
function sinh(x) {
    return ((x = Math.exp(x)) - 1 / x) / 2;
}
function tanh(x) {
    return ((x = Math.exp(2 * x)) - 1) / (x + 1);
}
const __TURBOPACK__default__export__ = function zoomRho(rho, rho2, rho4) {
    // p0 = [ux0, uy0, w0]
    // p1 = [ux1, uy1, w1]
    function zoom(p0, p1) {
        var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2], dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, i, S;
        // Special case for u0 ≅ u1.
        if (d2 < epsilon2) {
            S = Math.log(w1 / w0) / rho;
            i = function(t) {
                return [
                    ux0 + t * dx,
                    uy0 + t * dy,
                    w0 * Math.exp(rho * t * S)
                ];
            };
        } else {
            var d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1), b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
            S = (r1 - r0) / rho;
            i = function(t) {
                var s = t * S, coshr0 = cosh(r0), u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
                return [
                    ux0 + u * dx,
                    uy0 + u * dy,
                    w0 * coshr0 / cosh(rho * s + r0)
                ];
            };
        }
        i.duration = S * 1000 * rho / Math.SQRT2;
        return i;
    }
    zoom.rho = function(_) {
        var _1 = Math.max(1e-3, +_), _2 = _1 * _1, _4 = _2 * _2;
        return zoomRho(_1, _2, _4);
    };
    return zoom;
}(Math.SQRT2, 2, 4);
}),
"[project]/frontend/node_modules/d3-interpolate/src/zoom.js [app-client] (ecmascript) <export default as interpolateZoom>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "interpolateZoom",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$zoom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$zoom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/zoom.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-selection/src/array.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Given something array like (or null), returns something that is strictly an
// array. This is used to ensure that array-like objects passed to d3.selectAll
// or selection.selectAll are converted into proper arrays when creating a
// selection; we don’t ever want to create a selection backed by a live
// HTMLCollection or NodeList. However, note that selection.selectAll will use a
// static NodeList as a group, since it safely derived from querySelectorAll.
__turbopack_context__.s([
    "default",
    ()=>array
]);
function array(x) {
    return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
}
}),
"[project]/frontend/node_modules/d3-selection/src/constant.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(x) {
    return function() {
        return x;
    };
}
}),
"[project]/frontend/node_modules/d3-selection/src/creator.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespace$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/namespace.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespaces$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/namespaces.js [app-client] (ecmascript)");
;
;
function creatorInherit(name) {
    return function() {
        var document = this.ownerDocument, uri = this.namespaceURI;
        return uri === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespaces$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["xhtml"] && document.documentElement.namespaceURI === __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespaces$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["xhtml"] ? document.createElement(name) : document.createElementNS(uri, name);
    };
}
function creatorFixed(fullname) {
    return function() {
        return this.ownerDocument.createElementNS(fullname.space, fullname.local);
    };
}
function __TURBOPACK__default__export__(name) {
    var fullname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespace$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(name);
    return (fullname.local ? creatorFixed : creatorInherit)(fullname);
}
}),
"[project]/frontend/node_modules/d3-selection/src/matcher.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "childMatcher",
    ()=>childMatcher,
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(selector) {
    return function() {
        return this.matches(selector);
    };
}
function childMatcher(selector) {
    return function(node) {
        return node.matches(selector);
    };
}
}),
"[project]/frontend/node_modules/d3-selection/src/matcher.js [app-client] (ecmascript) <export default as matcher>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "matcher",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$matcher$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$matcher$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/matcher.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-selection/src/namespace.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespaces$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/namespaces.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(name) {
    var prefix = name += "", i = prefix.indexOf(":");
    if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
    return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespaces$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].hasOwnProperty(prefix) ? {
        space: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespaces$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"][prefix],
        local: name
    } : name; // eslint-disable-line no-prototype-builtins
}
}),
"[project]/frontend/node_modules/d3-selection/src/namespace.js [app-client] (ecmascript) <export default as namespace>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "namespace",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespace$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespace$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/namespace.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-selection/src/namespaces.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "xhtml",
    ()=>xhtml
]);
var xhtml = "http://www.w3.org/1999/xhtml";
const __TURBOPACK__default__export__ = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: xhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
};
}),
"[project]/frontend/node_modules/d3-selection/src/pointer.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$sourceEvent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/sourceEvent.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(event, node) {
    event = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$sourceEvent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(event);
    if (node === undefined) node = event.currentTarget;
    if (node) {
        var svg = node.ownerSVGElement || node;
        if (svg.createSVGPoint) {
            var point = svg.createSVGPoint();
            point.x = event.clientX, point.y = event.clientY;
            point = point.matrixTransform(node.getScreenCTM().inverse());
            return [
                point.x,
                point.y
            ];
        }
        if (node.getBoundingClientRect) {
            var rect = node.getBoundingClientRect();
            return [
                event.clientX - rect.left - node.clientLeft,
                event.clientY - rect.top - node.clientTop
            ];
        }
    }
    return [
        event.pageX,
        event.pageY
    ];
}
}),
"[project]/frontend/node_modules/d3-selection/src/pointer.js [app-client] (ecmascript) <export default as pointer>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "pointer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/pointer.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-selection/src/select.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(selector) {
    return typeof selector === "string" ? new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"]([
        [
            document.querySelector(selector)
        ]
    ], [
        document.documentElement
    ]) : new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"]([
        [
            selector
        ]
    ], __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["root"]);
}
}),
"[project]/frontend/node_modules/d3-selection/src/select.js [app-client] (ecmascript) <export default as select>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "select",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/select.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-selection/src/selection/append.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$creator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/creator.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(name) {
    var create = typeof name === "function" ? name : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$creator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(name);
    return this.select(function() {
        return this.appendChild(create.apply(this, arguments));
    });
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/attr.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespace$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/namespace.js [app-client] (ecmascript)");
;
function attrRemove(name) {
    return function() {
        this.removeAttribute(name);
    };
}
function attrRemoveNS(fullname) {
    return function() {
        this.removeAttributeNS(fullname.space, fullname.local);
    };
}
function attrConstant(name, value) {
    return function() {
        this.setAttribute(name, value);
    };
}
function attrConstantNS(fullname, value) {
    return function() {
        this.setAttributeNS(fullname.space, fullname.local, value);
    };
}
function attrFunction(name, value) {
    return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttribute(name);
        else this.setAttribute(name, v);
    };
}
function attrFunctionNS(fullname, value) {
    return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
        else this.setAttributeNS(fullname.space, fullname.local, v);
    };
}
function __TURBOPACK__default__export__(name, value) {
    var fullname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespace$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(name);
    if (arguments.length < 2) {
        var node = this.node();
        return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
    }
    return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/call.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__() {
    var callback = arguments[0];
    arguments[0] = this;
    callback.apply(null, arguments);
    return this;
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/classed.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function classArray(string) {
    return string.trim().split(/^|\s+/);
}
function classList(node) {
    return node.classList || new ClassList(node);
}
function ClassList(node) {
    this._node = node;
    this._names = classArray(node.getAttribute("class") || "");
}
ClassList.prototype = {
    add: function(name) {
        var i = this._names.indexOf(name);
        if (i < 0) {
            this._names.push(name);
            this._node.setAttribute("class", this._names.join(" "));
        }
    },
    remove: function(name) {
        var i = this._names.indexOf(name);
        if (i >= 0) {
            this._names.splice(i, 1);
            this._node.setAttribute("class", this._names.join(" "));
        }
    },
    contains: function(name) {
        return this._names.indexOf(name) >= 0;
    }
};
function classedAdd(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while(++i < n)list.add(names[i]);
}
function classedRemove(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while(++i < n)list.remove(names[i]);
}
function classedTrue(names) {
    return function() {
        classedAdd(this, names);
    };
}
function classedFalse(names) {
    return function() {
        classedRemove(this, names);
    };
}
function classedFunction(names, value) {
    return function() {
        (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
    };
}
function __TURBOPACK__default__export__(name, value) {
    var names = classArray(name + "");
    if (arguments.length < 2) {
        var list = classList(this.node()), i = -1, n = names.length;
        while(++i < n)if (!list.contains(names[i])) return false;
        return true;
    }
    return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/clone.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function selection_cloneShallow() {
    var clone = this.cloneNode(false), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function selection_cloneDeep() {
    var clone = this.cloneNode(true), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function __TURBOPACK__default__export__(deep) {
    return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/data.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$enter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/enter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/constant.js [app-client] (ecmascript)");
;
;
;
function bindIndex(parent, group, enter, update, exit, data) {
    var i = 0, node, groupLength = group.length, dataLength = data.length;
    // Put any non-null nodes that fit into update.
    // Put any null nodes into enter.
    // Put any remaining data into enter.
    for(; i < dataLength; ++i){
        if (node = group[i]) {
            node.__data__ = data[i];
            update[i] = node;
        } else {
            enter[i] = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$enter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EnterNode"](parent, data[i]);
        }
    }
    // Put any non-null nodes that don’t fit into exit.
    for(; i < groupLength; ++i){
        if (node = group[i]) {
            exit[i] = node;
        }
    }
}
function bindKey(parent, group, enter, update, exit, data, key) {
    var i, node, nodeByKeyValue = new Map, groupLength = group.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
    // Compute the key for each node.
    // If multiple nodes have the same key, the duplicates are added to exit.
    for(i = 0; i < groupLength; ++i){
        if (node = group[i]) {
            keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
            if (nodeByKeyValue.has(keyValue)) {
                exit[i] = node;
            } else {
                nodeByKeyValue.set(keyValue, node);
            }
        }
    }
    // Compute the key for each datum.
    // If there a node associated with this key, join and add it to update.
    // If there is not (or the key is a duplicate), add it to enter.
    for(i = 0; i < dataLength; ++i){
        keyValue = key.call(parent, data[i], i, data) + "";
        if (node = nodeByKeyValue.get(keyValue)) {
            update[i] = node;
            node.__data__ = data[i];
            nodeByKeyValue.delete(keyValue);
        } else {
            enter[i] = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$enter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EnterNode"](parent, data[i]);
        }
    }
    // Add any remaining nodes that were not bound to data to exit.
    for(i = 0; i < groupLength; ++i){
        if ((node = group[i]) && nodeByKeyValue.get(keyValues[i]) === node) {
            exit[i] = node;
        }
    }
}
function datum(node) {
    return node.__data__;
}
function __TURBOPACK__default__export__(value, key) {
    if (!arguments.length) return Array.from(this, datum);
    var bind = key ? bindKey : bindIndex, parents = this._parents, groups = this._groups;
    if (typeof value !== "function") value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(value);
    for(var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j){
        var parent = parents[j], group = groups[j], groupLength = group.length, data = arraylike(value.call(parent, parent && parent.__data__, j, parents)), dataLength = data.length, enterGroup = enter[j] = new Array(dataLength), updateGroup = update[j] = new Array(dataLength), exitGroup = exit[j] = new Array(groupLength);
        bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);
        // Now connect the enter nodes to their following update node, such that
        // appendChild can insert the materialized enter node before this node,
        // rather than at the end of the parent node.
        for(var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0){
            if (previous = enterGroup[i0]) {
                if (i0 >= i1) i1 = i0 + 1;
                while(!(next = updateGroup[i1]) && ++i1 < dataLength);
                previous._next = next || null;
            }
        }
    }
    update = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"](update, parents);
    update._enter = enter;
    update._exit = exit;
    return update;
}
// Given some data, this returns an array-like view of it: an object that
// exposes a length property and allows numeric indexing. Note that unlike
// selectAll, this isn’t worried about “live” collections because the resulting
// array will only be used briefly while data is being bound. (It is possible to
// cause the data to change while iterating by using a key function, but please
// don’t; we’d rather avoid a gratuitous copy.)
function arraylike(data) {
    return typeof data === "object" && "length" in data ? data // Array, TypedArray, NodeList, array-like
     : Array.from(data); // Map, Set, iterable, string, or anything else
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/datum.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(value) {
    return arguments.length ? this.property("__data__", value) : this.node().__data__;
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/dispatch.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$window$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/window.js [app-client] (ecmascript)");
;
function dispatchEvent(node, type, params) {
    var window = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$window$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(node), event = window.CustomEvent;
    if (typeof event === "function") {
        event = new event(type, params);
    } else {
        event = window.document.createEvent("Event");
        if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
        else event.initEvent(type, false, false);
    }
    node.dispatchEvent(event);
}
function dispatchConstant(type, params) {
    return function() {
        return dispatchEvent(this, type, params);
    };
}
function dispatchFunction(type, params) {
    return function() {
        return dispatchEvent(this, type, params.apply(this, arguments));
    };
}
function __TURBOPACK__default__export__(type, params) {
    return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/each.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(callback) {
    for(var groups = this._groups, j = 0, m = groups.length; j < m; ++j){
        for(var group = groups[j], i = 0, n = group.length, node; i < n; ++i){
            if (node = group[i]) callback.call(node, node.__data__, i, group);
        }
    }
    return this;
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/empty.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__() {
    return !this.node();
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/enter.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EnterNode",
    ()=>EnterNode,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$sparse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/sparse.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript)");
;
;
function __TURBOPACK__default__export__() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"](this._enter || this._groups.map(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$sparse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]), this._parents);
}
function EnterNode(parent, datum) {
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum;
}
EnterNode.prototype = {
    constructor: EnterNode,
    appendChild: function(child) {
        return this._parent.insertBefore(child, this._next);
    },
    insertBefore: function(child, next) {
        return this._parent.insertBefore(child, next);
    },
    querySelector: function(selector) {
        return this._parent.querySelector(selector);
    },
    querySelectorAll: function(selector) {
        return this._parent.querySelectorAll(selector);
    }
};
}),
"[project]/frontend/node_modules/d3-selection/src/selection/exit.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$sparse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/sparse.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript)");
;
;
function __TURBOPACK__default__export__() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"](this._exit || this._groups.map(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$sparse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]), this._parents);
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/filter.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$matcher$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/matcher.js [app-client] (ecmascript)");
;
;
function __TURBOPACK__default__export__(match) {
    if (typeof match !== "function") match = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$matcher$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(match);
    for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i){
            if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
                subgroup.push(node);
            }
        }
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"](subgroups, this._parents);
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/html.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function htmlRemove() {
    this.innerHTML = "";
}
function htmlConstant(value) {
    return function() {
        this.innerHTML = value;
    };
}
function htmlFunction(value) {
    return function() {
        var v = value.apply(this, arguments);
        this.innerHTML = v == null ? "" : v;
    };
}
function __TURBOPACK__default__export__(value) {
    return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Selection",
    ()=>Selection,
    "default",
    ()=>__TURBOPACK__default__export__,
    "root",
    ()=>root
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/select.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$selectAll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/selectAll.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$selectChild$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/selectChild.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$selectChildren$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/selectChildren.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/filter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$data$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/data.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$enter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/enter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$exit$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/exit.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$join$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/join.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/merge.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$order$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/order.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$sort$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/sort.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$call$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/call.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$nodes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/nodes.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$node$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/node.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$size$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/size.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$empty$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/empty.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$each$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/each.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$attr$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/attr.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$classed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/classed.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/text.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/html.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$raise$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/raise.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$lower$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/lower.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$append$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/append.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$insert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/insert.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$remove$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/remove.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$clone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/clone.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$datum$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/datum.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$on$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/on.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$dispatch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/dispatch.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$iterator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/iterator.js [app-client] (ecmascript)");
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
;
var root = [
    null
];
function Selection(groups, parents) {
    this._groups = groups;
    this._parents = parents;
}
function selection() {
    return new Selection([
        [
            document.documentElement
        ]
    ], root);
}
function selection_selection() {
    return this;
}
Selection.prototype = selection.prototype = {
    constructor: Selection,
    select: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    selectAll: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$selectAll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    selectChild: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$selectChild$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    selectChildren: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$selectChildren$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    filter: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    data: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$data$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    enter: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$enter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    exit: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$exit$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    join: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$join$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    merge: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    selection: selection_selection,
    order: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$order$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    sort: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$sort$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    call: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$call$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    nodes: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$nodes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    node: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$node$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    size: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$size$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    empty: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$empty$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    each: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$each$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    attr: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$attr$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    style: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    property: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    classed: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$classed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    text: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    html: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$html$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    raise: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$raise$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    lower: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$lower$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    append: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$append$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    insert: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$insert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    remove: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$remove$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    clone: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$clone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    datum: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$datum$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    on: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$on$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    dispatch: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$dispatch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    [Symbol.iterator]: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$iterator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
};
const __TURBOPACK__default__export__ = selection;
}),
"[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript) <export default as selection>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "selection",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-selection/src/selection/insert.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$creator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/creator.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selector.js [app-client] (ecmascript)");
;
;
function constantNull() {
    return null;
}
function __TURBOPACK__default__export__(name, before) {
    var create = typeof name === "function" ? name : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$creator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(name), select = before == null ? constantNull : typeof before === "function" ? before : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(before);
    return this.select(function() {
        return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
    });
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/iterator.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function* __TURBOPACK__default__export__() {
    for(var groups = this._groups, j = 0, m = groups.length; j < m; ++j){
        for(var group = groups[j], i = 0, n = group.length, node; i < n; ++i){
            if (node = group[i]) yield node;
        }
    }
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/join.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(onenter, onupdate, onexit) {
    var enter = this.enter(), update = this, exit = this.exit();
    if (typeof onenter === "function") {
        enter = onenter(enter);
        if (enter) enter = enter.selection();
    } else {
        enter = enter.append(onenter + "");
    }
    if (onupdate != null) {
        update = onupdate(update);
        if (update) update = update.selection();
    }
    if (onexit == null) exit.remove();
    else onexit(exit);
    return enter && update ? enter.merge(update).order() : update;
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/lower.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function lower() {
    if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function __TURBOPACK__default__export__() {
    return this.each(lower);
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/merge.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(context) {
    var selection = context.selection ? context.selection() : context;
    for(var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j){
        for(var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i){
            if (node = group0[i] || group1[i]) {
                merge[i] = node;
            }
        }
    }
    for(; j < m0; ++j){
        merges[j] = groups0[j];
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"](merges, this._parents);
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/node.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__() {
    for(var groups = this._groups, j = 0, m = groups.length; j < m; ++j){
        for(var group = groups[j], i = 0, n = group.length; i < n; ++i){
            var node = group[i];
            if (node) return node;
        }
    }
    return null;
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/nodes.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__() {
    return Array.from(this);
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/on.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function contextListener(listener) {
    return function(event) {
        listener.call(this, event, this.__data__);
    };
}
function parseTypenames(typenames) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        return {
            type: t,
            name: name
        };
    });
}
function onRemove(typename) {
    return function() {
        var on = this.__on;
        if (!on) return;
        for(var j = 0, i = -1, m = on.length, o; j < m; ++j){
            if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
                this.removeEventListener(o.type, o.listener, o.options);
            } else {
                on[++i] = o;
            }
        }
        if (++i) on.length = i;
        else delete this.__on;
    };
}
function onAdd(typename, value, options) {
    return function() {
        var on = this.__on, o, listener = contextListener(value);
        if (on) for(var j = 0, m = on.length; j < m; ++j){
            if ((o = on[j]).type === typename.type && o.name === typename.name) {
                this.removeEventListener(o.type, o.listener, o.options);
                this.addEventListener(o.type, o.listener = listener, o.options = options);
                o.value = value;
                return;
            }
        }
        this.addEventListener(typename.type, listener, options);
        o = {
            type: typename.type,
            name: typename.name,
            value: value,
            listener: listener,
            options: options
        };
        if (!on) this.__on = [
            o
        ];
        else on.push(o);
    };
}
function __TURBOPACK__default__export__(typename, value, options) {
    var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;
    if (arguments.length < 2) {
        var on = this.node().__on;
        if (on) for(var j = 0, m = on.length, o; j < m; ++j){
            for(i = 0, o = on[j]; i < n; ++i){
                if ((t = typenames[i]).type === o.type && t.name === o.name) {
                    return o.value;
                }
            }
        }
        return;
    }
    on = value ? onAdd : onRemove;
    for(i = 0; i < n; ++i)this.each(on(typenames[i], value, options));
    return this;
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/order.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__() {
    for(var groups = this._groups, j = -1, m = groups.length; ++j < m;){
        for(var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;){
            if (node = group[i]) {
                if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
                next = node;
            }
        }
    }
    return this;
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/property.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function propertyRemove(name) {
    return function() {
        delete this[name];
    };
}
function propertyConstant(name, value) {
    return function() {
        this[name] = value;
    };
}
function propertyFunction(name, value) {
    return function() {
        var v = value.apply(this, arguments);
        if (v == null) delete this[name];
        else this[name] = v;
    };
}
function __TURBOPACK__default__export__(name, value) {
    return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/raise.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function raise() {
    if (this.nextSibling) this.parentNode.appendChild(this);
}
function __TURBOPACK__default__export__() {
    return this.each(raise);
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/remove.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function remove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
}
function __TURBOPACK__default__export__() {
    return this.each(remove);
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/select.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selector.js [app-client] (ecmascript)");
;
;
function __TURBOPACK__default__export__(select) {
    if (typeof select !== "function") select = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(select);
    for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i){
            if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
                if ("__data__" in node) subnode.__data__ = node.__data__;
                subgroup[i] = subnode;
            }
        }
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"](subgroups, this._parents);
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/selectAll.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/array.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selectorAll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selectorAll.js [app-client] (ecmascript)");
;
;
;
function arrayAll(select) {
    return function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$array$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(select.apply(this, arguments));
    };
}
function __TURBOPACK__default__export__(select) {
    if (typeof select === "function") select = arrayAll(select);
    else select = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selectorAll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(select);
    for(var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, node, i = 0; i < n; ++i){
            if (node = group[i]) {
                subgroups.push(select.call(node, node.__data__, i, group));
                parents.push(node);
            }
        }
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"](subgroups, parents);
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/selectChild.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$matcher$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/matcher.js [app-client] (ecmascript)");
;
var find = Array.prototype.find;
function childFind(match) {
    return function() {
        return find.call(this.children, match);
    };
}
function childFirst() {
    return this.firstElementChild;
}
function __TURBOPACK__default__export__(match) {
    return this.select(match == null ? childFirst : childFind(typeof match === "function" ? match : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$matcher$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["childMatcher"])(match)));
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/selectChildren.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$matcher$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/matcher.js [app-client] (ecmascript)");
;
var filter = Array.prototype.filter;
function children() {
    return Array.from(this.children);
}
function childrenFilter(match) {
    return function() {
        return filter.call(this.children, match);
    };
}
function __TURBOPACK__default__export__(match) {
    return this.selectAll(match == null ? children : childrenFilter(typeof match === "function" ? match : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$matcher$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["childMatcher"])(match)));
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/size.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__() {
    let size = 0;
    for (const node of this)++size; // eslint-disable-line no-unused-vars
    return size;
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/sort.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(compare) {
    if (!compare) compare = ascending;
    function compareNode(a, b) {
        return a && b ? compare(a.__data__, b.__data__) : !a - !b;
    }
    for(var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i){
            if (node = group[i]) {
                sortgroup[i] = node;
            }
        }
        sortgroup.sort(compareNode);
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Selection"](sortgroups, this._parents).order();
}
function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/sparse.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(update) {
    return new Array(update.length);
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/style.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "styleValue",
    ()=>styleValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$window$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/window.js [app-client] (ecmascript)");
;
function styleRemove(name) {
    return function() {
        this.style.removeProperty(name);
    };
}
function styleConstant(name, value, priority) {
    return function() {
        this.style.setProperty(name, value, priority);
    };
}
function styleFunction(name, value, priority) {
    return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.style.removeProperty(name);
        else this.style.setProperty(name, v, priority);
    };
}
function __TURBOPACK__default__export__(name, value, priority) {
    return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
}
function styleValue(node, name) {
    return node.style.getPropertyValue(name) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$window$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(node).getComputedStyle(node, null).getPropertyValue(name);
}
}),
"[project]/frontend/node_modules/d3-selection/src/selection/style.js [app-client] (ecmascript) <export styleValue as style>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "style",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["styleValue"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/style.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-selection/src/selection/text.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function textRemove() {
    this.textContent = "";
}
function textConstant(value) {
    return function() {
        this.textContent = value;
    };
}
function textFunction(value) {
    return function() {
        var v = value.apply(this, arguments);
        this.textContent = v == null ? "" : v;
    };
}
function __TURBOPACK__default__export__(value) {
    return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
}
}),
"[project]/frontend/node_modules/d3-selection/src/selector.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function none() {}
function __TURBOPACK__default__export__(selector) {
    return selector == null ? none : function() {
        return this.querySelector(selector);
    };
}
}),
"[project]/frontend/node_modules/d3-selection/src/selector.js [app-client] (ecmascript) <export default as selector>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "selector",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selector.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-selection/src/selectorAll.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function empty() {
    return [];
}
function __TURBOPACK__default__export__(selector) {
    return selector == null ? empty : function() {
        return this.querySelectorAll(selector);
    };
}
}),
"[project]/frontend/node_modules/d3-selection/src/selectorAll.js [app-client] (ecmascript) <export default as selectorAll>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "selectorAll",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selectorAll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selectorAll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selectorAll.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-selection/src/sourceEvent.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(event) {
    let sourceEvent;
    while(sourceEvent = event.sourceEvent)event = sourceEvent;
    return event;
}
}),
"[project]/frontend/node_modules/d3-selection/src/window.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function __TURBOPACK__default__export__(node) {
    return node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView; // node is a Document
}
}),
"[project]/frontend/node_modules/d3-timer/src/timeout.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$timer$2f$src$2f$timer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-timer/src/timer.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(callback, delay, time) {
    var t = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$timer$2f$src$2f$timer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Timer"];
    delay = delay == null ? 0 : +delay;
    t.restart((elapsed)=>{
        t.stop();
        callback(elapsed + delay);
    }, delay, time);
    return t;
}
}),
"[project]/frontend/node_modules/d3-timer/src/timeout.js [app-client] (ecmascript) <export default as timeout>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "timeout",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$timer$2f$src$2f$timeout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$timer$2f$src$2f$timeout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-timer/src/timeout.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-timer/src/timer.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Timer",
    ()=>Timer,
    "now",
    ()=>now,
    "timer",
    ()=>timer,
    "timerFlush",
    ()=>timerFlush
]);
var frame = 0, timeout = 0, interval = 0, pokeDelay = 1000, taskHead, taskTail, clockLast = 0, clockNow = 0, clockSkew = 0, clock = typeof performance === "object" && performance.now ? performance : Date, setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
    setTimeout(f, 17);
};
function now() {
    return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}
function clearNow() {
    clockNow = 0;
}
function Timer() {
    this._call = this._time = this._next = null;
}
Timer.prototype = timer.prototype = {
    constructor: Timer,
    restart: function(callback, delay, time) {
        if (typeof callback !== "function") throw new TypeError("callback is not a function");
        time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
        if (!this._next && taskTail !== this) {
            if (taskTail) taskTail._next = this;
            else taskHead = this;
            taskTail = this;
        }
        this._call = callback;
        this._time = time;
        sleep();
    },
    stop: function() {
        if (this._call) {
            this._call = null;
            this._time = Infinity;
            sleep();
        }
    }
};
function timer(callback, delay, time) {
    var t = new Timer;
    t.restart(callback, delay, time);
    return t;
}
function timerFlush() {
    now(); // Get the current time, if not already set.
    ++frame; // Pretend we’ve set an alarm, if we haven’t already.
    var t = taskHead, e;
    while(t){
        if ((e = clockNow - t._time) >= 0) t._call.call(undefined, e);
        t = t._next;
    }
    --frame;
}
function wake() {
    clockNow = (clockLast = clock.now()) + clockSkew;
    frame = timeout = 0;
    try {
        timerFlush();
    } finally{
        frame = 0;
        nap();
        clockNow = 0;
    }
}
function poke() {
    var now = clock.now(), delay = now - clockLast;
    if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
}
function nap() {
    var t0, t1 = taskHead, t2, time = Infinity;
    while(t1){
        if (t1._call) {
            if (time > t1._time) time = t1._time;
            t0 = t1, t1 = t1._next;
        } else {
            t2 = t1._next, t1._next = null;
            t1 = t0 ? t0._next = t2 : taskHead = t2;
        }
    }
    taskTail = t0;
    sleep(time);
}
function sleep(time) {
    if (frame) return; // Soonest alarm already set, or will be.
    if (timeout) timeout = clearTimeout(timeout);
    var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
    if (delay > 24) {
        if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
        if (interval) interval = clearInterval(interval);
    } else {
        if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
        frame = 1, setFrame(wake);
    }
}
}),
"[project]/frontend/node_modules/d3-transition/src/index.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/selection/index.js [app-client] (ecmascript)");
;
;
;
;
}),
"[project]/frontend/node_modules/d3-transition/src/interrupt.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(node, name) {
    var schedules = node.__transition, schedule, active, empty = true, i;
    if (!schedules) return;
    name = name == null ? null : name + "";
    for(i in schedules){
        if ((schedule = schedules[i]).name !== name) {
            empty = false;
            continue;
        }
        active = schedule.state > __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STARTING"] && schedule.state < __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENDING"];
        schedule.state = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENDED"];
        schedule.timer.stop();
        schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
        delete schedules[i];
    }
    if (empty) delete node.__transition;
}
}),
"[project]/frontend/node_modules/d3-transition/src/interrupt.js [app-client] (ecmascript) <export default as interrupt>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "interrupt",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/interrupt.js [app-client] (ecmascript)");
}),
"[project]/frontend/node_modules/d3-transition/src/selection/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__selection$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript) <export default as selection>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$selection$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/selection/interrupt.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$selection$2f$transition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/selection/transition.js [app-client] (ecmascript)");
;
;
;
__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__selection$3e$__["selection"].prototype.interrupt = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$selection$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__selection$3e$__["selection"].prototype.transition = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$selection$2f$transition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
}),
"[project]/frontend/node_modules/d3-transition/src/selection/interrupt.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/interrupt.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(name) {
    return this.each(function() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(this, name);
    });
}
}),
"[project]/frontend/node_modules/d3-transition/src/selection/transition.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$ease$2f$src$2f$cubic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__cubicInOut__as__easeCubicInOut$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-ease/src/cubic.js [app-client] (ecmascript) <export cubicInOut as easeCubicInOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$timer$2f$src$2f$timer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-timer/src/timer.js [app-client] (ecmascript)");
;
;
;
;
var defaultTiming = {
    time: null,
    delay: 0,
    duration: 250,
    ease: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$ease$2f$src$2f$cubic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__cubicInOut__as__easeCubicInOut$3e$__["easeCubicInOut"]
};
function inherit(node, id) {
    var timing;
    while(!(timing = node.__transition) || !(timing = timing[id])){
        if (!(node = node.parentNode)) {
            throw new Error(`transition ${id} not found`);
        }
    }
    return timing;
}
function __TURBOPACK__default__export__(name) {
    var id, timing;
    if (name instanceof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transition"]) {
        id = name._id, name = name._name;
    } else {
        id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["newId"])(), (timing = defaultTiming).time = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$timer$2f$src$2f$timer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["now"])(), name = name == null ? null : name + "";
    }
    for(var groups = this._groups, m = groups.length, j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, node, i = 0; i < n; ++i){
            if (node = group[i]) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(node, name, id, i, group, timing || inherit(node, id));
            }
        }
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transition"](groups, this._parents, name, id);
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/attr.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/transform/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespace$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__namespace$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/namespace.js [app-client] (ecmascript) <export default as namespace>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$tween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/tween.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$interpolate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/interpolate.js [app-client] (ecmascript)");
;
;
;
;
function attrRemove(name) {
    return function() {
        this.removeAttribute(name);
    };
}
function attrRemoveNS(fullname) {
    return function() {
        this.removeAttributeNS(fullname.space, fullname.local);
    };
}
function attrConstant(name, interpolate, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
        var string0 = this.getAttribute(name);
        return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
    };
}
function attrConstantNS(fullname, interpolate, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
        var string0 = this.getAttributeNS(fullname.space, fullname.local);
        return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
    };
}
function attrFunction(name, interpolate, value) {
    var string00, string10, interpolate0;
    return function() {
        var string0, value1 = value(this), string1;
        if (value1 == null) return void this.removeAttribute(name);
        string0 = this.getAttribute(name);
        string1 = value1 + "";
        return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
}
function attrFunctionNS(fullname, interpolate, value) {
    var string00, string10, interpolate0;
    return function() {
        var string0, value1 = value(this), string1;
        if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
        string0 = this.getAttributeNS(fullname.space, fullname.local);
        string1 = value1 + "";
        return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
}
function __TURBOPACK__default__export__(name, value) {
    var fullname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespace$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__namespace$3e$__["namespace"])(name), i = fullname === "transform" ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["interpolateTransformSvg"] : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$interpolate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
    return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$tween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenValue"])(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname) : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/attrTween.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespace$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__namespace$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/namespace.js [app-client] (ecmascript) <export default as namespace>");
;
function attrInterpolate(name, i) {
    return function(t) {
        this.setAttribute(name, i.call(this, t));
    };
}
function attrInterpolateNS(fullname, i) {
    return function(t) {
        this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
    };
}
function attrTweenNS(fullname, value) {
    var t0, i0;
    function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
        return t0;
    }
    tween._value = value;
    return tween;
}
function attrTween(name, value) {
    var t0, i0;
    function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
        return t0;
    }
    tween._value = value;
    return tween;
}
function __TURBOPACK__default__export__(name, value) {
    var key = "attr." + name;
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    var fullname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$namespace$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__namespace$3e$__["namespace"])(name);
    return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/delay.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
;
function delayFunction(id, value) {
    return function() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["init"])(this, id).delay = +value.apply(this, arguments);
    };
}
function delayConstant(id, value) {
    return value = +value, function() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["init"])(this, id).delay = value;
    };
}
function __TURBOPACK__default__export__(value) {
    var id = this._id;
    return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id, value)) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(this.node(), id).delay;
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/duration.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
;
function durationFunction(id, value) {
    return function() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(this, id).duration = +value.apply(this, arguments);
    };
}
function durationConstant(id, value) {
    return value = +value, function() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(this, id).duration = value;
    };
}
function __TURBOPACK__default__export__(value) {
    var id = this._id;
    return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id, value)) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(this.node(), id).duration;
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/ease.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
;
function easeConstant(id, value) {
    if (typeof value !== "function") throw new Error;
    return function() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(this, id).ease = value;
    };
}
function __TURBOPACK__default__export__(value) {
    var id = this._id;
    return arguments.length ? this.each(easeConstant(id, value)) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(this.node(), id).ease;
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/easeVarying.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
;
function easeVarying(id, value) {
    return function() {
        var v = value.apply(this, arguments);
        if (typeof v !== "function") throw new Error;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(this, id).ease = v;
    };
}
function __TURBOPACK__default__export__(value) {
    if (typeof value !== "function") throw new Error;
    return this.each(easeVarying(this._id, value));
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/end.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__() {
    var on0, on1, that = this, id = that._id, size = that.size();
    return new Promise(function(resolve, reject) {
        var cancel = {
            value: reject
        }, end = {
            value: function() {
                if (--size === 0) resolve();
            }
        };
        that.each(function() {
            var schedule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(this, id), on = schedule.on;
            // If this node shared a dispatch with the previous node,
            // just assign the updated shared dispatch and we’re done!
            // Otherwise, copy-on-write.
            if (on !== on0) {
                on1 = (on0 = on).copy();
                on1._.cancel.push(cancel);
                on1._.interrupt.push(cancel);
                on1._.end.push(end);
            }
            schedule.on = on1;
        });
        // The selection was empty, resolve end immediately
        if (size === 0) resolve();
    });
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/filter.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$matcher$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__matcher$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/matcher.js [app-client] (ecmascript) <export default as matcher>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/index.js [app-client] (ecmascript)");
;
;
function __TURBOPACK__default__export__(match) {
    if (typeof match !== "function") match = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$matcher$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__matcher$3e$__["matcher"])(match);
    for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i){
            if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
                subgroup.push(node);
            }
        }
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transition"](subgroups, this._parents, this._name, this._id);
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Transition",
    ()=>Transition,
    "default",
    ()=>transition,
    "newId",
    ()=>newId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__selection$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript) <export default as selection>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$attr$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/attr.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$attrTween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/attrTween.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$delay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/delay.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$duration$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/duration.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$ease$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/ease.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$easeVarying$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/easeVarying.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/filter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/merge.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$on$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/on.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$remove$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/remove.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/select.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$selectAll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/selectAll.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$selection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/selection.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$styleTween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/styleTween.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/text.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$textTween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/textTween.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$transition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/transition.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$tween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/tween.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$end$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/end.js [app-client] (ecmascript)");
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
var id = 0;
function Transition(groups, parents, name, id) {
    this._groups = groups;
    this._parents = parents;
    this._name = name;
    this._id = id;
}
function transition(name) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__selection$3e$__["selection"])().transition(name);
}
function newId() {
    return ++id;
}
var selection_prototype = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__selection$3e$__["selection"].prototype;
Transition.prototype = transition.prototype = {
    constructor: Transition,
    select: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    selectAll: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$selectAll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    selectChild: selection_prototype.selectChild,
    selectChildren: selection_prototype.selectChildren,
    filter: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    merge: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$merge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    selection: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$selection$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    transition: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$transition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    call: selection_prototype.call,
    nodes: selection_prototype.nodes,
    node: selection_prototype.node,
    size: selection_prototype.size,
    empty: selection_prototype.empty,
    each: selection_prototype.each,
    on: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$on$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    attr: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$attr$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    attrTween: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$attrTween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    style: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    styleTween: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$styleTween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    text: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    textTween: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$textTween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    remove: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$remove$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    tween: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$tween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    delay: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$delay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    duration: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$duration$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    ease: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$ease$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    easeVarying: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$easeVarying$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    end: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$end$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    [Symbol.iterator]: selection_prototype[Symbol.iterator]
};
}),
"[project]/frontend/node_modules/d3-transition/src/transition/interpolate.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__color$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-color/src/color.js [app-client] (ecmascript) <export default as color>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interpolateNumber$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/number.js [app-client] (ecmascript) <export default as interpolateNumber>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$rgb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interpolateRgb$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/rgb.js [app-client] (ecmascript) <export default as interpolateRgb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$string$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interpolateString$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/string.js [app-client] (ecmascript) <export default as interpolateString>");
;
;
function __TURBOPACK__default__export__(a, b) {
    var c;
    return (typeof b === "number" ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interpolateNumber$3e$__["interpolateNumber"] : b instanceof __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__color$3e$__["color"] ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$rgb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interpolateRgb$3e$__["interpolateRgb"] : (c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$color$2f$src$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__color$3e$__["color"])(b)) ? (b = c, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$rgb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interpolateRgb$3e$__["interpolateRgb"]) : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$string$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interpolateString$3e$__["interpolateString"])(a, b);
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/merge.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/index.js [app-client] (ecmascript)");
;
function __TURBOPACK__default__export__(transition) {
    if (transition._id !== this._id) throw new Error;
    for(var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j){
        for(var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i){
            if (node = group0[i] || group1[i]) {
                merge[i] = node;
            }
        }
    }
    for(; j < m0; ++j){
        merges[j] = groups0[j];
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transition"](merges, this._parents, this._name, this._id);
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/on.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
;
function start(name) {
    return (name + "").trim().split(/^|\s+/).every(function(t) {
        var i = t.indexOf(".");
        if (i >= 0) t = t.slice(0, i);
        return !t || t === "start";
    });
}
function onFunction(id, name, listener) {
    var on0, on1, sit = start(name) ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["init"] : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"];
    return function() {
        var schedule = sit(this, id), on = schedule.on;
        // If this node shared a dispatch with the previous node,
        // just assign the updated shared dispatch and we’re done!
        // Otherwise, copy-on-write.
        if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);
        schedule.on = on1;
    };
}
function __TURBOPACK__default__export__(name, listener) {
    var id = this._id;
    return arguments.length < 2 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(this.node(), id).on.on(name) : this.each(onFunction(id, name, listener));
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/remove.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function removeFunction(id) {
    return function() {
        var parent = this.parentNode;
        for(var i in this.__transition)if (+i !== id) return;
        if (parent) parent.removeChild(this);
    };
}
function __TURBOPACK__default__export__() {
    return this.on("end.remove", removeFunction(this._id));
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CREATED",
    ()=>CREATED,
    "ENDED",
    ()=>ENDED,
    "ENDING",
    ()=>ENDING,
    "RUNNING",
    ()=>RUNNING,
    "SCHEDULED",
    ()=>SCHEDULED,
    "STARTED",
    ()=>STARTED,
    "STARTING",
    ()=>STARTING,
    "default",
    ()=>__TURBOPACK__default__export__,
    "get",
    ()=>get,
    "init",
    ()=>init,
    "set",
    ()=>set
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$dispatch$2f$src$2f$dispatch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__dispatch$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-dispatch/src/dispatch.js [app-client] (ecmascript) <export default as dispatch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$timer$2f$src$2f$timer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-timer/src/timer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$timer$2f$src$2f$timeout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__timeout$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-timer/src/timeout.js [app-client] (ecmascript) <export default as timeout>");
;
;
var emptyOn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$dispatch$2f$src$2f$dispatch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__dispatch$3e$__["dispatch"])("start", "end", "cancel", "interrupt");
var emptyTween = [];
var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;
function __TURBOPACK__default__export__(node, name, id, index, group, timing) {
    var schedules = node.__transition;
    if (!schedules) node.__transition = {};
    else if (id in schedules) return;
    create(node, id, {
        name: name,
        index: index,
        group: group,
        on: emptyOn,
        tween: emptyTween,
        time: timing.time,
        delay: timing.delay,
        duration: timing.duration,
        ease: timing.ease,
        timer: null,
        state: CREATED
    });
}
function init(node, id) {
    var schedule = get(node, id);
    if (schedule.state > CREATED) throw new Error("too late; already scheduled");
    return schedule;
}
function set(node, id) {
    var schedule = get(node, id);
    if (schedule.state > STARTED) throw new Error("too late; already running");
    return schedule;
}
function get(node, id) {
    var schedule = node.__transition;
    if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
    return schedule;
}
function create(node, id, self) {
    var schedules = node.__transition, tween;
    // Initialize the self timer when the transition is created.
    // Note the actual delay is not known until the first callback!
    schedules[id] = self;
    self.timer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$timer$2f$src$2f$timer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timer"])(schedule, 0, self.time);
    function schedule(elapsed) {
        self.state = SCHEDULED;
        self.timer.restart(start, self.delay, self.time);
        // If the elapsed delay is less than our first sleep, start immediately.
        if (self.delay <= elapsed) start(elapsed - self.delay);
    }
    function start(elapsed) {
        var i, j, n, o;
        // If the state is not SCHEDULED, then we previously errored on start.
        if (self.state !== SCHEDULED) return stop();
        for(i in schedules){
            o = schedules[i];
            if (o.name !== self.name) continue;
            // While this element already has a starting transition during this frame,
            // defer starting an interrupting transition until that transition has a
            // chance to tick (and possibly end); see d3/d3-transition#54!
            if (o.state === STARTED) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$timer$2f$src$2f$timeout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__timeout$3e$__["timeout"])(start);
            // Interrupt the active transition, if any.
            if (o.state === RUNNING) {
                o.state = ENDED;
                o.timer.stop();
                o.on.call("interrupt", node, node.__data__, o.index, o.group);
                delete schedules[i];
            } else if (+i < id) {
                o.state = ENDED;
                o.timer.stop();
                o.on.call("cancel", node, node.__data__, o.index, o.group);
                delete schedules[i];
            }
        }
        // Defer the first tick to end of the current frame; see d3/d3#1576.
        // Note the transition may be canceled after start and before the first tick!
        // Note this must be scheduled before the start event; see d3/d3-transition#16!
        // Assuming this is successful, subsequent callbacks go straight to tick.
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$timer$2f$src$2f$timeout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__timeout$3e$__["timeout"])(function() {
            if (self.state === STARTED) {
                self.state = RUNNING;
                self.timer.restart(tick, self.delay, self.time);
                tick(elapsed);
            }
        });
        // Dispatch the start event.
        // Note this must be done before the tween are initialized.
        self.state = STARTING;
        self.on.call("start", node, node.__data__, self.index, self.group);
        if (self.state !== STARTING) return; // interrupted
        self.state = STARTED;
        // Initialize the tween, deleting null tween.
        tween = new Array(n = self.tween.length);
        for(i = 0, j = -1; i < n; ++i){
            if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
                tween[++j] = o;
            }
        }
        tween.length = j + 1;
    }
    function tick(elapsed) {
        var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1), i = -1, n = tween.length;
        while(++i < n){
            tween[i].call(node, t);
        }
        // Dispatch the end event.
        if (self.state === ENDING) {
            self.on.call("end", node, node.__data__, self.index, self.group);
            stop();
        }
    }
    function stop() {
        self.state = ENDED;
        self.timer.stop();
        delete schedules[id];
        for(var i in schedules)return; // eslint-disable-line no-unused-vars
        delete node.__transition;
    }
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/select.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__selector$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selector.js [app-client] (ecmascript) <export default as selector>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
;
;
;
function __TURBOPACK__default__export__(select) {
    var name = this._name, id = this._id;
    if (typeof select !== "function") select = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__selector$3e$__["selector"])(select);
    for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i){
            if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
                if ("__data__" in node) subnode.__data__ = node.__data__;
                subgroup[i] = subnode;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(subgroup[i], name, id, i, subgroup, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(node, id));
            }
        }
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transition"](subgroups, this._parents, name, id);
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/selectAll.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selectorAll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__selectorAll$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selectorAll.js [app-client] (ecmascript) <export default as selectorAll>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
;
;
;
function __TURBOPACK__default__export__(select) {
    var name = this._name, id = this._id;
    if (typeof select !== "function") select = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selectorAll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__selectorAll$3e$__["selectorAll"])(select);
    for(var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, node, i = 0; i < n; ++i){
            if (node = group[i]) {
                for(var children = select.call(node, node.__data__, i, group), child, inherit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(node, id), k = 0, l = children.length; k < l; ++k){
                    if (child = children[k]) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(child, name, id, k, children, inherit);
                    }
                }
                subgroups.push(children);
                parents.push(node);
            }
        }
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transition"](subgroups, parents, name, id);
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/selection.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__selection$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/index.js [app-client] (ecmascript) <export default as selection>");
;
var Selection = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__selection$3e$__["selection"].prototype.constructor;
function __TURBOPACK__default__export__() {
    return new Selection(this._groups, this._parents);
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/style.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/transform/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__styleValue__as__style$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/selection/style.js [app-client] (ecmascript) <export styleValue as style>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$tween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/tween.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$interpolate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/interpolate.js [app-client] (ecmascript)");
;
;
;
;
;
function styleNull(name, interpolate) {
    var string00, string10, interpolate0;
    return function() {
        var string0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__styleValue__as__style$3e$__["style"])(this, name), string1 = (this.style.removeProperty(name), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__styleValue__as__style$3e$__["style"])(this, name));
        return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate(string00 = string0, string10 = string1);
    };
}
function styleRemove(name) {
    return function() {
        this.style.removeProperty(name);
    };
}
function styleConstant(name, interpolate, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
        var string0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__styleValue__as__style$3e$__["style"])(this, name);
        return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
    };
}
function styleFunction(name, interpolate, value) {
    var string00, string10, interpolate0;
    return function() {
        var string0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__styleValue__as__style$3e$__["style"])(this, name), value1 = value(this), string1 = value1 + "";
        if (value1 == null) string1 = value1 = (this.style.removeProperty(name), (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$selection$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__styleValue__as__style$3e$__["style"])(this, name));
        return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
}
function styleMaybeRemove(id, name) {
    var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
    return function() {
        var schedule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(this, id), on = schedule.on, listener = schedule.value[key] == null ? remove || (remove = styleRemove(name)) : undefined;
        // If this node shared a dispatch with the previous node,
        // just assign the updated shared dispatch and we’re done!
        // Otherwise, copy-on-write.
        if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);
        schedule.on = on1;
    };
}
function __TURBOPACK__default__export__(name, value, priority) {
    var i = (name += "") === "transform" ? __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$transform$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["interpolateTransformCss"] : __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$interpolate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
    return value == null ? this.styleTween(name, styleNull(name, i)).on("end.style." + name, styleRemove(name)) : typeof value === "function" ? this.styleTween(name, styleFunction(name, i, (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$tween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenValue"])(this, "style." + name, value))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant(name, i, value), priority).on("end.style." + name, null);
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/styleTween.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function styleInterpolate(name, i, priority) {
    return function(t) {
        this.style.setProperty(name, i.call(this, t), priority);
    };
}
function styleTween(name, value, priority) {
    var t, i0;
    function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
        return t;
    }
    tween._value = value;
    return tween;
}
function __TURBOPACK__default__export__(name, value, priority) {
    var key = "style." + (name += "");
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/text.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$tween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/tween.js [app-client] (ecmascript)");
;
function textConstant(value) {
    return function() {
        this.textContent = value;
    };
}
function textFunction(value) {
    return function() {
        var value1 = value(this);
        this.textContent = value1 == null ? "" : value1;
    };
}
function __TURBOPACK__default__export__(value) {
    return this.tween("text", typeof value === "function" ? textFunction((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$tween$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tweenValue"])(this, "text", value)) : textConstant(value == null ? "" : value + ""));
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/textTween.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function textInterpolate(i) {
    return function(t) {
        this.textContent = i.call(this, t);
    };
}
function textTween(value) {
    var t0, i0;
    function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
        return t0;
    }
    tween._value = value;
    return tween;
}
function __TURBOPACK__default__export__(value) {
    var key = "text";
    if (arguments.length < 1) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    return this.tween(key, textTween(value));
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/transition.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
;
;
function __TURBOPACK__default__export__() {
    var name = this._name, id0 = this._id, id1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["newId"])();
    for(var groups = this._groups, m = groups.length, j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, node, i = 0; i < n; ++i){
            if (node = group[i]) {
                var inherit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(node, id0);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(node, name, id1, i, group, {
                    time: inherit.time + inherit.delay + inherit.duration,
                    delay: 0,
                    duration: inherit.duration,
                    ease: inherit.ease
                });
            }
        }
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transition"](groups, this._parents, name, id1);
}
}),
"[project]/frontend/node_modules/d3-transition/src/transition/tween.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "tweenValue",
    ()=>tweenValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/transition/schedule.js [app-client] (ecmascript)");
;
function tweenRemove(id, name) {
    var tween0, tween1;
    return function() {
        var schedule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(this, id), tween = schedule.tween;
        // If this node shared tween with the previous node,
        // just assign the updated shared tween and we’re done!
        // Otherwise, copy-on-write.
        if (tween !== tween0) {
            tween1 = tween0 = tween;
            for(var i = 0, n = tween1.length; i < n; ++i){
                if (tween1[i].name === name) {
                    tween1 = tween1.slice();
                    tween1.splice(i, 1);
                    break;
                }
            }
        }
        schedule.tween = tween1;
    };
}
function tweenFunction(id, name, value) {
    var tween0, tween1;
    if (typeof value !== "function") throw new Error;
    return function() {
        var schedule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(this, id), tween = schedule.tween;
        // If this node shared tween with the previous node,
        // just assign the updated shared tween and we’re done!
        // Otherwise, copy-on-write.
        if (tween !== tween0) {
            tween1 = (tween0 = tween).slice();
            for(var t = {
                name: name,
                value: value
            }, i = 0, n = tween1.length; i < n; ++i){
                if (tween1[i].name === name) {
                    tween1[i] = t;
                    break;
                }
            }
            if (i === n) tween1.push(t);
        }
        schedule.tween = tween1;
    };
}
function __TURBOPACK__default__export__(name, value) {
    var id = this._id;
    name += "";
    if (arguments.length < 2) {
        var tween = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(this.node(), id).tween;
        for(var i = 0, n = tween.length, t; i < n; ++i){
            if ((t = tween[i]).name === name) {
                return t.value;
            }
        }
        return null;
    }
    return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
}
function tweenValue(transition, name, value) {
    var id = transition._id;
    transition.each(function() {
        var schedule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["set"])(this, id);
        (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
    });
    return function(node) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$transition$2f$schedule$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(node, id).value[name];
    };
}
}),
"[project]/frontend/node_modules/d3-zoom/src/constant.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = (x)=>()=>x;
}),
"[project]/frontend/node_modules/d3-zoom/src/event.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ZoomEvent
]);
function ZoomEvent(type, { sourceEvent, target, transform, dispatch }) {
    Object.defineProperties(this, {
        type: {
            value: type,
            enumerable: true,
            configurable: true
        },
        sourceEvent: {
            value: sourceEvent,
            enumerable: true,
            configurable: true
        },
        target: {
            value: target,
            enumerable: true,
            configurable: true
        },
        transform: {
            value: transform,
            enumerable: true,
            configurable: true
        },
        _: {
            value: dispatch
        }
    });
}
}),
"[project]/frontend/node_modules/d3-zoom/src/index.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$zoom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-zoom/src/zoom.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$transform$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-zoom/src/transform.js [app-client] (ecmascript)");
;
;
}),
"[project]/frontend/node_modules/d3-zoom/src/noevent.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "nopropagation",
    ()=>nopropagation
]);
function nopropagation(event) {
    event.stopImmediatePropagation();
}
function __TURBOPACK__default__export__(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
}
}),
"[project]/frontend/node_modules/d3-zoom/src/transform.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Transform",
    ()=>Transform,
    "default",
    ()=>transform,
    "identity",
    ()=>identity
]);
function Transform(k, x, y) {
    this.k = k;
    this.x = x;
    this.y = y;
}
Transform.prototype = {
    constructor: Transform,
    scale: function(k) {
        return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
    },
    translate: function(x, y) {
        return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
    },
    apply: function(point) {
        return [
            point[0] * this.k + this.x,
            point[1] * this.k + this.y
        ];
    },
    applyX: function(x) {
        return x * this.k + this.x;
    },
    applyY: function(y) {
        return y * this.k + this.y;
    },
    invert: function(location) {
        return [
            (location[0] - this.x) / this.k,
            (location[1] - this.y) / this.k
        ];
    },
    invertX: function(x) {
        return (x - this.x) / this.k;
    },
    invertY: function(y) {
        return (y - this.y) / this.k;
    },
    rescaleX: function(x) {
        return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
    },
    rescaleY: function(y) {
        return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
    },
    toString: function() {
        return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
    }
};
var identity = new Transform(1, 0, 0);
transform.prototype = Transform.prototype;
function transform(node) {
    while(!node.__zoom)if (!(node = node.parentNode)) return identity;
    return node.__zoom;
}
}),
"[project]/frontend/node_modules/d3-zoom/src/zoom.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$dispatch$2f$src$2f$dispatch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__dispatch$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-dispatch/src/dispatch.js [app-client] (ecmascript) <export default as dispatch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$nodrag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__dragDisable$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-drag/src/nodrag.js [app-client] (ecmascript) <export default as dragDisable>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$nodrag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__yesdrag__as__dragEnable$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-drag/src/nodrag.js [app-client] (ecmascript) <export yesdrag as dragEnable>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$zoom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interpolateZoom$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-interpolate/src/zoom.js [app-client] (ecmascript) <export default as interpolateZoom>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/select.js [app-client] (ecmascript) <export default as select>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__pointer$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/pointer.js [app-client] (ecmascript) <export default as pointer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interrupt$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/interrupt.js [app-client] (ecmascript) <export default as interrupt>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-zoom/src/constant.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$event$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-zoom/src/event.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$transform$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-zoom/src/transform.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-zoom/src/noevent.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
// Ignore right-click, since that should open the context menu.
// except for pinch-to-zoom, which is sent as a wheel+ctrlKey event
function defaultFilter(event) {
    return (!event.ctrlKey || event.type === 'wheel') && !event.button;
}
function defaultExtent() {
    var e = this;
    if (e instanceof SVGElement) {
        e = e.ownerSVGElement || e;
        if (e.hasAttribute("viewBox")) {
            e = e.viewBox.baseVal;
            return [
                [
                    e.x,
                    e.y
                ],
                [
                    e.x + e.width,
                    e.y + e.height
                ]
            ];
        }
        return [
            [
                0,
                0
            ],
            [
                e.width.baseVal.value,
                e.height.baseVal.value
            ]
        ];
    }
    return [
        [
            0,
            0
        ],
        [
            e.clientWidth,
            e.clientHeight
        ]
    ];
}
function defaultTransform() {
    return this.__zoom || __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$transform$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["identity"];
}
function defaultWheelDelta(event) {
    return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * (event.ctrlKey ? 10 : 1);
}
function defaultTouchable() {
    return navigator.maxTouchPoints || "ontouchstart" in this;
}
function defaultConstrain(transform, extent, translateExtent) {
    var dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0], dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0], dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1], dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
    return transform.translate(dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1), dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1));
}
function __TURBOPACK__default__export__() {
    var filter = defaultFilter, extent = defaultExtent, constrain = defaultConstrain, wheelDelta = defaultWheelDelta, touchable = defaultTouchable, scaleExtent = [
        0,
        Infinity
    ], translateExtent = [
        [
            -Infinity,
            -Infinity
        ],
        [
            Infinity,
            Infinity
        ]
    ], duration = 250, interpolate = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$interpolate$2f$src$2f$zoom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interpolateZoom$3e$__["interpolateZoom"], listeners = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$dispatch$2f$src$2f$dispatch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__dispatch$3e$__["dispatch"])("start", "zoom", "end"), touchstarting, touchfirst, touchending, touchDelay = 500, wheelDelay = 150, clickDistance2 = 0, tapDistance = 10;
    function zoom(selection) {
        selection.property("__zoom", defaultTransform).on("wheel.zoom", wheeled, {
            passive: false
        }).on("mousedown.zoom", mousedowned).on("dblclick.zoom", dblclicked).filter(touchable).on("touchstart.zoom", touchstarted).on("touchmove.zoom", touchmoved).on("touchend.zoom touchcancel.zoom", touchended).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
    }
    zoom.transform = function(collection, transform, point, event) {
        var selection = collection.selection ? collection.selection() : collection;
        selection.property("__zoom", defaultTransform);
        if (collection !== selection) {
            schedule(collection, transform, point, event);
        } else {
            selection.interrupt().each(function() {
                gesture(this, arguments).event(event).start().zoom(null, typeof transform === "function" ? transform.apply(this, arguments) : transform).end();
            });
        }
    };
    zoom.scaleBy = function(selection, k, p, event) {
        zoom.scaleTo(selection, function() {
            var k0 = this.__zoom.k, k1 = typeof k === "function" ? k.apply(this, arguments) : k;
            return k0 * k1;
        }, p, event);
    };
    zoom.scaleTo = function(selection, k, p, event) {
        zoom.transform(selection, function() {
            var e = extent.apply(this, arguments), t0 = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p, p1 = t0.invert(p0), k1 = typeof k === "function" ? k.apply(this, arguments) : k;
            return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
        }, p, event);
    };
    zoom.translateBy = function(selection, x, y, event) {
        zoom.transform(selection, function() {
            return constrain(this.__zoom.translate(typeof x === "function" ? x.apply(this, arguments) : x, typeof y === "function" ? y.apply(this, arguments) : y), extent.apply(this, arguments), translateExtent);
        }, null, event);
    };
    zoom.translateTo = function(selection, x, y, p, event) {
        zoom.transform(selection, function() {
            var e = extent.apply(this, arguments), t = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
            return constrain(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$transform$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["identity"].translate(p0[0], p0[1]).scale(t.k).translate(typeof x === "function" ? -x.apply(this, arguments) : -x, typeof y === "function" ? -y.apply(this, arguments) : -y), e, translateExtent);
        }, p, event);
    };
    function scale(transform, k) {
        k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
        return k === transform.k ? transform : new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$transform$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transform"](k, transform.x, transform.y);
    }
    function translate(transform, p0, p1) {
        var x = p0[0] - p1[0] * transform.k, y = p0[1] - p1[1] * transform.k;
        return x === transform.x && y === transform.y ? transform : new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$transform$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transform"](transform.k, x, y);
    }
    function centroid(extent) {
        return [
            (+extent[0][0] + +extent[1][0]) / 2,
            (+extent[0][1] + +extent[1][1]) / 2
        ];
    }
    function schedule(transition, transform, point, event) {
        transition.on("start.zoom", function() {
            gesture(this, arguments).event(event).start();
        }).on("interrupt.zoom end.zoom", function() {
            gesture(this, arguments).event(event).end();
        }).tween("zoom", function() {
            var that = this, args = arguments, g = gesture(that, args).event(event), e = extent.apply(that, args), p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point, w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]), a = that.__zoom, b = typeof transform === "function" ? transform.apply(that, args) : transform, i = interpolate(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
            return function(t) {
                if (t === 1) t = b; // Avoid rounding error on end.
                else {
                    var l = i(t), k = w / l[2];
                    t = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$transform$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transform"](k, p[0] - l[0] * k, p[1] - l[1] * k);
                }
                g.zoom(null, t);
            };
        });
    }
    function gesture(that, args, clean) {
        return !clean && that.__zooming || new Gesture(that, args);
    }
    function Gesture(that, args) {
        this.that = that;
        this.args = args;
        this.active = 0;
        this.sourceEvent = null;
        this.extent = extent.apply(that, args);
        this.taps = 0;
    }
    Gesture.prototype = {
        event: function(event) {
            if (event) this.sourceEvent = event;
            return this;
        },
        start: function() {
            if (++this.active === 1) {
                this.that.__zooming = this;
                this.emit("start");
            }
            return this;
        },
        zoom: function(key, transform) {
            if (this.mouse && key !== "mouse") this.mouse[1] = transform.invert(this.mouse[0]);
            if (this.touch0 && key !== "touch") this.touch0[1] = transform.invert(this.touch0[0]);
            if (this.touch1 && key !== "touch") this.touch1[1] = transform.invert(this.touch1[0]);
            this.that.__zoom = transform;
            this.emit("zoom");
            return this;
        },
        end: function() {
            if (--this.active === 0) {
                delete this.that.__zooming;
                this.emit("end");
            }
            return this;
        },
        emit: function(type) {
            var d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(this.that).datum();
            listeners.call(type, this.that, new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$event$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](type, {
                sourceEvent: this.sourceEvent,
                target: zoom,
                type,
                transform: this.that.__zoom,
                dispatch: listeners
            }), d);
        }
    };
    function wheeled(event, ...args) {
        if (!filter.apply(this, arguments)) return;
        var g = gesture(this, args).event(event), t = this.__zoom, k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))), p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__pointer$3e$__["pointer"])(event);
        // If the mouse is in the same location as before, reuse it.
        // If there were recent wheel events, reset the wheel idle timeout.
        if (g.wheel) {
            if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
                g.mouse[1] = t.invert(g.mouse[0] = p);
            }
            clearTimeout(g.wheel);
        } else if (t.k === k) return;
        else {
            g.mouse = [
                p,
                t.invert(p)
            ];
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interrupt$3e$__["interrupt"])(this);
            g.start();
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(event);
        g.wheel = setTimeout(wheelidled, wheelDelay);
        g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));
        function wheelidled() {
            g.wheel = null;
            g.end();
        }
    }
    function mousedowned(event, ...args) {
        if (touchending || !filter.apply(this, arguments)) return;
        var currentTarget = event.currentTarget, g = gesture(this, args, true).event(event), v = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true), p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__pointer$3e$__["pointer"])(event, currentTarget), x0 = event.clientX, y0 = event.clientY;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$nodrag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__dragDisable$3e$__["dragDisable"])(event.view);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nopropagation"])(event);
        g.mouse = [
            p,
            this.__zoom.invert(p)
        ];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interrupt$3e$__["interrupt"])(this);
        g.start();
        function mousemoved(event) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(event);
            if (!g.moved) {
                var dx = event.clientX - x0, dy = event.clientY - y0;
                g.moved = dx * dx + dy * dy > clickDistance2;
            }
            g.event(event).zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__pointer$3e$__["pointer"])(event, currentTarget), g.mouse[1]), g.extent, translateExtent));
        }
        function mouseupped(event) {
            v.on("mousemove.zoom mouseup.zoom", null);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$drag$2f$src$2f$nodrag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__yesdrag__as__dragEnable$3e$__["dragEnable"])(event.view, g.moved);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(event);
            g.event(event).end();
        }
    }
    function dblclicked(event, ...args) {
        if (!filter.apply(this, arguments)) return;
        var t0 = this.__zoom, p0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__pointer$3e$__["pointer"])(event.changedTouches ? event.changedTouches[0] : event, this), p1 = t0.invert(p0), k1 = t0.k * (event.shiftKey ? 0.5 : 2), t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, args), translateExtent);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(event);
        if (duration > 0) (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(this).transition().duration(duration).call(schedule, t1, p0, event);
        else (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(this).call(zoom.transform, t1, p0, event);
    }
    function touchstarted(event, ...args) {
        if (!filter.apply(this, arguments)) return;
        var touches = event.touches, n = touches.length, g = gesture(this, args, event.changedTouches.length === n).event(event), started, i, t, p;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nopropagation"])(event);
        for(i = 0; i < n; ++i){
            t = touches[i], p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__pointer$3e$__["pointer"])(t, this);
            p = [
                p,
                this.__zoom.invert(p),
                t.identifier
            ];
            if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;
            else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
        }
        if (touchstarting) touchstarting = clearTimeout(touchstarting);
        if (started) {
            if (g.taps < 2) touchfirst = p[0], touchstarting = setTimeout(function() {
                touchstarting = null;
            }, touchDelay);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$interrupt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__interrupt$3e$__["interrupt"])(this);
            g.start();
        }
    }
    function touchmoved(event, ...args) {
        if (!this.__zooming) return;
        var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t, p, l;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(event);
        for(i = 0; i < n; ++i){
            t = touches[i], p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__pointer$3e$__["pointer"])(t, this);
            if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;
            else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
        }
        t = g.that.__zoom;
        if (g.touch1) {
            var p0 = g.touch0[0], l0 = g.touch0[1], p1 = g.touch1[0], l1 = g.touch1[1], dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp, dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
            t = scale(t, Math.sqrt(dp / dl));
            p = [
                (p0[0] + p1[0]) / 2,
                (p0[1] + p1[1]) / 2
            ];
            l = [
                (l0[0] + l1[0]) / 2,
                (l0[1] + l1[1]) / 2
            ];
        } else if (g.touch0) p = g.touch0[0], l = g.touch0[1];
        else return;
        g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
    }
    function touchended(event, ...args) {
        if (!this.__zooming) return;
        var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$noevent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nopropagation"])(event);
        if (touchending) clearTimeout(touchending);
        touchending = setTimeout(function() {
            touchending = null;
        }, touchDelay);
        for(i = 0; i < n; ++i){
            t = touches[i];
            if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;
            else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
        }
        if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
        if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
        else {
            g.end();
            // If this was a dbltap, reroute to the (optional) dblclick.zoom handler.
            if (g.taps === 2) {
                t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$pointer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__pointer$3e$__["pointer"])(t, this);
                if (Math.hypot(touchfirst[0] - t[0], touchfirst[1] - t[1]) < tapDistance) {
                    var p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])(this).on("dblclick.zoom");
                    if (p) p.apply(this, arguments);
                }
            }
        }
    }
    zoom.wheelDelta = function(_) {
        return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(+_), zoom) : wheelDelta;
    };
    zoom.filter = function(_) {
        return arguments.length ? (filter = typeof _ === "function" ? _ : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(!!_), zoom) : filter;
    };
    zoom.touchable = function(_) {
        return arguments.length ? (touchable = typeof _ === "function" ? _ : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(!!_), zoom) : touchable;
    };
    zoom.extent = function(_) {
        return arguments.length ? (extent = typeof _ === "function" ? _ : (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$constant$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])([
            [
                +_[0][0],
                +_[0][1]
            ],
            [
                +_[1][0],
                +_[1][1]
            ]
        ]), zoom) : extent;
    };
    zoom.scaleExtent = function(_) {
        return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom) : [
            scaleExtent[0],
            scaleExtent[1]
        ];
    };
    zoom.translateExtent = function(_) {
        return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom) : [
            [
                translateExtent[0][0],
                translateExtent[0][1]
            ],
            [
                translateExtent[1][0],
                translateExtent[1][1]
            ]
        ];
    };
    zoom.constrain = function(_) {
        return arguments.length ? (constrain = _, zoom) : constrain;
    };
    zoom.duration = function(_) {
        return arguments.length ? (duration = +_, zoom) : duration;
    };
    zoom.interpolate = function(_) {
        return arguments.length ? (interpolate = _, zoom) : interpolate;
    };
    zoom.on = function() {
        var value = listeners.on.apply(listeners, arguments);
        return value === listeners ? zoom : value;
    };
    zoom.clickDistance = function(_) {
        return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom) : Math.sqrt(clickDistance2);
    };
    zoom.tapDistance = function(_) {
        return arguments.length ? (tapDistance = +_, zoom) : tapDistance;
    };
    return zoom;
}
}),
"[project]/frontend/node_modules/d3/src/index.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$brush$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-brush/src/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$transition$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-transition/src/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$zoom$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-zoom/src/index.js [app-client] (ecmascript) <locals>");
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
;
;
;
;
;
;
;
;
}),
"[project]/frontend/node_modules/dayjs/dayjs.min.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

!function(t, e) {
    ("TURBOPACK compile-time truthy", 1) ? module.exports = e() : "TURBOPACK unreachable";
}(/*TURBOPACK member replacement*/ __turbopack_context__.e, function() {
    "use strict";
    var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s = "minute", u = "hour", a = "day", o = "week", c = "month", f = "quarter", h = "year", d = "date", l = "Invalid Date", $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|YYYY|YY|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = {
        name: "en",
        weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        ordinal: function(t) {
            var e = [
                "th",
                "st",
                "nd",
                "rd"
            ], n = t % 100;
            return "[" + t + (e[(n - 20) % 10] || e[n] || e[0]) + "]";
        }
    }, m = function(t, e, n) {
        var r = String(t);
        return !r || r.length >= e ? t : "" + Array(e + 1 - r.length).join(n) + t;
    }, v = {
        s: m,
        z: function(t) {
            var e = -t.utcOffset(), n = Math.abs(e), r = Math.floor(n / 60), i = n % 60;
            return (e <= 0 ? "+" : "-") + m(r, 2, "0") + ":" + m(i, 2, "0");
        },
        m: function t(e, n) {
            if (e.date() < n.date()) return -t(n, e);
            var r = 12 * (n.year() - e.year()) + (n.month() - e.month()), i = e.clone().add(r, c), s = n - i < 0, u = e.clone().add(r + (s ? -1 : 1), c);
            return +(-(r + (n - i) / (s ? i - u : u - i)) || 0);
        },
        a: function(t) {
            return t < 0 ? Math.ceil(t) || 0 : Math.floor(t);
        },
        p: function(t) {
            return ({
                M: c,
                y: h,
                w: o,
                d: a,
                D: d,
                h: u,
                m: s,
                s: i,
                ms: r,
                Q: f
            })[t] || String(t || "").toLowerCase().replace(/s$/, "");
        },
        u: function(t) {
            return void 0 === t;
        }
    }, g = "en", D = {};
    D[g] = M;
    var p = "$isDayjsObject", S = function(t) {
        return t instanceof _ || !(!t || !t[p]);
    }, w = function t(e, n, r) {
        var i;
        if (!e) return g;
        if ("string" == typeof e) {
            var s = e.toLowerCase();
            D[s] && (i = s), n && (D[s] = n, i = s);
            var u = e.split("-");
            if (!i && u.length > 1) return t(u[0]);
        } else {
            var a = e.name;
            D[a] = e, i = a;
        }
        return !r && i && (g = i), i || !r && g;
    }, O = function(t, e) {
        if (S(t)) return t.clone();
        var n = "object" == typeof e ? e : {};
        return n.date = t, n.args = arguments, new _(n);
    }, b = v;
    b.l = w, b.i = S, b.w = function(t, e) {
        return O(t, {
            locale: e.$L,
            utc: e.$u,
            x: e.$x,
            $offset: e.$offset
        });
    };
    var _ = function() {
        function M(t) {
            this.$L = w(t.locale, null, !0), this.parse(t), this.$x = this.$x || t.x || {}, this[p] = !0;
        }
        var m = M.prototype;
        return m.parse = function(t) {
            this.$d = function(t) {
                var e = t.date, n = t.utc;
                if (null === e) return new Date(NaN);
                if (b.u(e)) return new Date;
                if (e instanceof Date) return new Date(e);
                if ("string" == typeof e && !/Z$/i.test(e)) {
                    var r = e.match($);
                    if (r) {
                        var i = r[2] - 1 || 0, s = (r[7] || "0").substring(0, 3);
                        return n ? new Date(Date.UTC(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, s)) : new Date(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, s);
                    }
                }
                return new Date(e);
            }(t), this.init();
        }, m.init = function() {
            var t = this.$d;
            this.$y = t.getFullYear(), this.$M = t.getMonth(), this.$D = t.getDate(), this.$W = t.getDay(), this.$H = t.getHours(), this.$m = t.getMinutes(), this.$s = t.getSeconds(), this.$ms = t.getMilliseconds();
        }, m.$utils = function() {
            return b;
        }, m.isValid = function() {
            return !(this.$d.toString() === l);
        }, m.isSame = function(t, e) {
            var n = O(t);
            return this.startOf(e) <= n && n <= this.endOf(e);
        }, m.isAfter = function(t, e) {
            return O(t) < this.startOf(e);
        }, m.isBefore = function(t, e) {
            return this.endOf(e) < O(t);
        }, m.$g = function(t, e, n) {
            return b.u(t) ? this[e] : this.set(n, t);
        }, m.unix = function() {
            return Math.floor(this.valueOf() / 1e3);
        }, m.valueOf = function() {
            return this.$d.getTime();
        }, m.startOf = function(t, e) {
            var n = this, r = !!b.u(e) || e, f = b.p(t), l = function(t, e) {
                var i = b.w(n.$u ? Date.UTC(n.$y, e, t) : new Date(n.$y, e, t), n);
                return r ? i : i.endOf(a);
            }, $ = function(t, e) {
                return b.w(n.toDate()[t].apply(n.toDate("s"), (r ? [
                    0,
                    0,
                    0,
                    0
                ] : [
                    23,
                    59,
                    59,
                    999
                ]).slice(e)), n);
            }, y = this.$W, M = this.$M, m = this.$D, v = "set" + (this.$u ? "UTC" : "");
            switch(f){
                case h:
                    return r ? l(1, 0) : l(31, 11);
                case c:
                    return r ? l(1, M) : l(0, M + 1);
                case o:
                    var g = this.$locale().weekStart || 0, D = (y < g ? y + 7 : y) - g;
                    return l(r ? m - D : m + (6 - D), M);
                case a:
                case d:
                    return $(v + "Hours", 0);
                case u:
                    return $(v + "Minutes", 1);
                case s:
                    return $(v + "Seconds", 2);
                case i:
                    return $(v + "Milliseconds", 3);
                default:
                    return this.clone();
            }
        }, m.endOf = function(t) {
            return this.startOf(t, !1);
        }, m.$set = function(t, e) {
            var n, o = b.p(t), f = "set" + (this.$u ? "UTC" : ""), l = (n = {}, n[a] = f + "Date", n[d] = f + "Date", n[c] = f + "Month", n[h] = f + "FullYear", n[u] = f + "Hours", n[s] = f + "Minutes", n[i] = f + "Seconds", n[r] = f + "Milliseconds", n)[o], $ = o === a ? this.$D + (e - this.$W) : e;
            if (o === c || o === h) {
                var y = this.clone().set(d, 1);
                y.$d[l]($), y.init(), this.$d = y.set(d, Math.min(this.$D, y.daysInMonth())).$d;
            } else l && this.$d[l]($);
            return this.init(), this;
        }, m.set = function(t, e) {
            return this.clone().$set(t, e);
        }, m.get = function(t) {
            return this[b.p(t)]();
        }, m.add = function(r, f) {
            var d, l = this;
            r = Number(r);
            var $ = b.p(f), y = function(t) {
                var e = O(l);
                return b.w(e.date(e.date() + Math.round(t * r)), l);
            };
            if ($ === c) return this.set(c, this.$M + r);
            if ($ === h) return this.set(h, this.$y + r);
            if ($ === a) return y(1);
            if ($ === o) return y(7);
            var M = (d = {}, d[s] = e, d[u] = n, d[i] = t, d)[$] || 1, m = this.$d.getTime() + r * M;
            return b.w(m, this);
        }, m.subtract = function(t, e) {
            return this.add(-1 * t, e);
        }, m.format = function(t) {
            var e = this, n = this.$locale();
            if (!this.isValid()) return n.invalidDate || l;
            var r = t || "YYYY-MM-DDTHH:mm:ssZ", i = b.z(this), s = this.$H, u = this.$m, a = this.$M, o = n.weekdays, c = n.months, f = n.meridiem, h = function(t, n, i, s) {
                return t && (t[n] || t(e, r)) || i[n].slice(0, s);
            }, d = function(t) {
                return b.s(s % 12 || 12, t, "0");
            }, $ = f || function(t, e, n) {
                var r = t < 12 ? "AM" : "PM";
                return n ? r.toLowerCase() : r;
            };
            return r.replace(y, function(t, r) {
                return r || function(t) {
                    switch(t){
                        case "YY":
                            return String(e.$y).slice(-2);
                        case "YYYY":
                            return b.s(e.$y, 4, "0");
                        case "M":
                            return a + 1;
                        case "MM":
                            return b.s(a + 1, 2, "0");
                        case "MMM":
                            return h(n.monthsShort, a, c, 3);
                        case "MMMM":
                            return h(c, a);
                        case "D":
                            return e.$D;
                        case "DD":
                            return b.s(e.$D, 2, "0");
                        case "d":
                            return String(e.$W);
                        case "dd":
                            return h(n.weekdaysMin, e.$W, o, 2);
                        case "ddd":
                            return h(n.weekdaysShort, e.$W, o, 3);
                        case "dddd":
                            return o[e.$W];
                        case "H":
                            return String(s);
                        case "HH":
                            return b.s(s, 2, "0");
                        case "h":
                            return d(1);
                        case "hh":
                            return d(2);
                        case "a":
                            return $(s, u, !0);
                        case "A":
                            return $(s, u, !1);
                        case "m":
                            return String(u);
                        case "mm":
                            return b.s(u, 2, "0");
                        case "s":
                            return String(e.$s);
                        case "ss":
                            return b.s(e.$s, 2, "0");
                        case "SSS":
                            return b.s(e.$ms, 3, "0");
                        case "Z":
                            return i;
                    }
                    return null;
                }(t) || i.replace(":", "");
            });
        }, m.utcOffset = function() {
            return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, m.diff = function(r, d, l) {
            var $, y = this, M = b.p(d), m = O(r), v = (m.utcOffset() - this.utcOffset()) * e, g = this - m, D = function() {
                return b.m(y, m);
            };
            switch(M){
                case h:
                    $ = D() / 12;
                    break;
                case c:
                    $ = D();
                    break;
                case f:
                    $ = D() / 3;
                    break;
                case o:
                    $ = (g - v) / 6048e5;
                    break;
                case a:
                    $ = (g - v) / 864e5;
                    break;
                case u:
                    $ = g / n;
                    break;
                case s:
                    $ = g / e;
                    break;
                case i:
                    $ = g / t;
                    break;
                default:
                    $ = g;
            }
            return l ? $ : b.a($);
        }, m.daysInMonth = function() {
            return this.endOf(c).$D;
        }, m.$locale = function() {
            return D[this.$L];
        }, m.locale = function(t, e) {
            if (!t) return this.$L;
            var n = this.clone(), r = w(t, e, !0);
            return r && (n.$L = r), n;
        }, m.clone = function() {
            return b.w(this.$d, this);
        }, m.toDate = function() {
            return new Date(this.valueOf());
        }, m.toJSON = function() {
            return this.isValid() ? this.toISOString() : null;
        }, m.toISOString = function() {
            return this.$d.toISOString();
        }, m.toString = function() {
            return this.$d.toUTCString();
        }, M;
    }(), Y = _.prototype;
    return O.prototype = Y, [
        [
            "$ms",
            r
        ],
        [
            "$s",
            i
        ],
        [
            "$m",
            s
        ],
        [
            "$H",
            u
        ],
        [
            "$W",
            a
        ],
        [
            "$M",
            c
        ],
        [
            "$y",
            h
        ],
        [
            "$D",
            d
        ]
    ].forEach(function(t) {
        Y[t[1]] = function(e) {
            return this.$g(e, t[0], t[1]);
        };
    }), O.extend = function(t, e) {
        return t.$i || (t(e, _, O), t.$i = !0), O;
    }, O.locale = w, O.isDayjs = S, O.unix = function(t) {
        return O(1e3 * t);
    }, O.en = D[g], O.Ls = D, O.p = {}, O;
});
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
"[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/cose-bilkent-JH36ORCC.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "render",
    ()=>render2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-X3CZISLH.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/mermaid/dist/chunks/mermaid.core/chunk-Y2CYZVJY.mjs [app-client] (ecmascript)");
// src/rendering-util/layout-algorithms/cose-bilkent/cytoscape-setup.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$cytoscape$2f$dist$2f$cytoscape$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/cytoscape/dist/cytoscape.esm.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$cytoscape$2d$cose$2d$bilkent$2f$cytoscape$2d$cose$2d$bilkent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/cytoscape-cose-bilkent/cytoscape-cose-bilkent.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3/src/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/d3-selection/src/select.js [app-client] (ecmascript) <export default as select>");
;
;
;
;
;
__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$cytoscape$2f$dist$2f$cytoscape$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].use(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$cytoscape$2d$cose$2d$bilkent$2f$cytoscape$2d$cose$2d$bilkent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
function addNodes(nodes, cy) {
    nodes.forEach((node)=>{
        const nodeData = {
            id: node.id,
            labelText: node.label,
            height: node.height,
            width: node.width,
            padding: node.padding ?? 0
        };
        Object.keys(node).forEach((key)=>{
            if (![
                "id",
                "label",
                "height",
                "width",
                "padding",
                "x",
                "y"
            ].includes(key)) {
                nodeData[key] = node[key];
            }
        });
        cy.add({
            group: "nodes",
            data: nodeData,
            position: {
                x: node.x ?? 0,
                y: node.y ?? 0
            }
        });
    });
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(addNodes, "addNodes");
function addEdges(edges, cy) {
    edges.forEach((edge)=>{
        const edgeData = {
            id: edge.id,
            source: edge.start,
            target: edge.end
        };
        Object.keys(edge).forEach((key)=>{
            if (![
                "id",
                "start",
                "end"
            ].includes(key)) {
                edgeData[key] = edge[key];
            }
        });
        cy.add({
            group: "edges",
            data: edgeData
        });
    });
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(addEdges, "addEdges");
function createCytoscapeInstance(data) {
    return new Promise((resolve)=>{
        const renderEl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$d3$2d$selection$2f$src$2f$select$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__select$3e$__["select"])("body").append("div").attr("id", "cy").attr("style", "display:none");
        const cy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$cytoscape$2f$dist$2f$cytoscape$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
            container: document.getElementById("cy"),
            // container to render in
            style: [
                {
                    selector: "edge",
                    style: {
                        "curve-style": "bezier"
                    }
                }
            ]
        });
        renderEl.remove();
        addNodes(data.nodes, cy);
        addEdges(data.edges, cy);
        cy.nodes().forEach(function(n) {
            n.layoutDimensions = ()=>{
                const nodeData = n.data();
                return {
                    w: nodeData.width,
                    h: nodeData.height
                };
            };
        });
        const layoutConfig = {
            name: "cose-bilkent",
            // @ts-ignore Types for cose-bilkent are not correct?
            quality: "proof",
            styleEnabled: false,
            animate: false
        };
        cy.layout(layoutConfig).run();
        cy.ready((e)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].info("Cytoscape ready", e);
            resolve(cy);
        });
    });
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(createCytoscapeInstance, "createCytoscapeInstance");
function extractPositionedNodes(cy) {
    return cy.nodes().map((node)=>{
        const data = node.data();
        const position = node.position();
        const positionedNode = {
            id: data.id,
            x: position.x,
            y: position.y
        };
        Object.keys(data).forEach((key)=>{
            if (key !== "id") {
                positionedNode[key] = data[key];
            }
        });
        return positionedNode;
    });
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(extractPositionedNodes, "extractPositionedNodes");
function extractPositionedEdges(cy) {
    return cy.edges().map((edge)=>{
        const data = edge.data();
        const rscratch = edge._private.rscratch;
        const positionedEdge = {
            id: data.id,
            source: data.source,
            target: data.target,
            startX: rscratch.startX,
            startY: rscratch.startY,
            midX: rscratch.midX,
            midY: rscratch.midY,
            endX: rscratch.endX,
            endY: rscratch.endY
        };
        Object.keys(data).forEach((key)=>{
            if (![
                "id",
                "source",
                "target"
            ].includes(key)) {
                positionedEdge[key] = data[key];
            }
        });
        return positionedEdge;
    });
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(extractPositionedEdges, "extractPositionedEdges");
// src/rendering-util/layout-algorithms/cose-bilkent/layout.ts
async function executeCoseBilkentLayout(data, _config) {
    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug("Starting cose-bilkent layout algorithm");
    try {
        validateLayoutData(data);
        const cy = await createCytoscapeInstance(data);
        const positionedNodes = extractPositionedNodes(cy);
        const positionedEdges = extractPositionedEdges(cy);
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].debug(`Layout completed: ${positionedNodes.length} nodes, ${positionedEdges.length} edges`);
        return {
            nodes: positionedNodes,
            edges: positionedEdges
        };
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$X3CZISLH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"].error("Error in cose-bilkent layout algorithm:", error);
        throw error;
    }
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(executeCoseBilkentLayout, "executeCoseBilkentLayout");
function validateLayoutData(data) {
    if (!data) {
        throw new Error("Layout data is required");
    }
    if (!data.config) {
        throw new Error("Configuration is required in layout data");
    }
    if (!data.rootNode) {
        throw new Error("Root node is required");
    }
    if (!data.nodes || !Array.isArray(data.nodes)) {
        throw new Error("No nodes found in layout data");
    }
    if (!Array.isArray(data.edges)) {
        throw new Error("Edges array is required in layout data");
    }
    return true;
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(validateLayoutData, "validateLayoutData");
// src/rendering-util/layout-algorithms/cose-bilkent/render.ts
var render = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$mermaid$2f$dist$2f$chunks$2f$mermaid$2e$core$2f$chunk$2d$Y2CYZVJY$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__name"])(async (data4Layout, svg, { insertCluster, insertEdge, insertEdgeLabel, insertMarkers, insertNode, log: log2, positionEdgeLabel }, { algorithm: _algorithm })=>{
    const nodeDb = {};
    const clusterDb = {};
    const element = svg.select("g");
    insertMarkers(element, data4Layout.markers, data4Layout.type, data4Layout.diagramId);
    const subGraphsEl = element.insert("g").attr("class", "subgraphs");
    const edgePaths = element.insert("g").attr("class", "edgePaths");
    const edgeLabels = element.insert("g").attr("class", "edgeLabels");
    const nodes = element.insert("g").attr("class", "nodes");
    log2.debug("Inserting nodes into DOM for dimension calculation");
    await Promise.all(data4Layout.nodes.map(async (node)=>{
        if (node.isGroup) {
            const clusterNode = {
                ...node
            };
            clusterDb[node.id] = clusterNode;
            nodeDb[node.id] = clusterNode;
            await insertCluster(subGraphsEl, node);
        } else {
            const nodeWithPosition = {
                ...node
            };
            nodeDb[node.id] = nodeWithPosition;
            const nodeEl = await insertNode(nodes, node, {
                config: data4Layout.config,
                dir: data4Layout.direction || "TB"
            });
            const boundingBox = nodeEl.node().getBBox();
            nodeWithPosition.width = boundingBox.width;
            nodeWithPosition.height = boundingBox.height;
            nodeWithPosition.domId = nodeEl;
            log2.debug(`Node ${node.id} dimensions: ${boundingBox.width}x${boundingBox.height}`);
        }
    }));
    log2.debug("Running cose-bilkent layout algorithm");
    const updatedLayoutData = {
        ...data4Layout,
        nodes: data4Layout.nodes.map((node)=>{
            const nodeWithDimensions = nodeDb[node.id];
            return {
                ...node,
                width: nodeWithDimensions.width,
                height: nodeWithDimensions.height
            };
        })
    };
    const layoutResult = await executeCoseBilkentLayout(updatedLayoutData, data4Layout.config);
    log2.debug("Positioning nodes based on layout results");
    layoutResult.nodes.forEach((positionedNode)=>{
        const node = nodeDb[positionedNode.id];
        if (node?.domId) {
            node.domId.attr("transform", `translate(${positionedNode.x}, ${positionedNode.y})`);
            node.x = positionedNode.x;
            node.y = positionedNode.y;
            log2.debug(`Positioned node ${node.id} at center (${positionedNode.x}, ${positionedNode.y})`);
        }
    });
    layoutResult.edges.forEach((positionedEdge)=>{
        const edge = data4Layout.edges.find((e)=>e.id === positionedEdge.id);
        if (edge) {
            edge.points = [
                {
                    x: positionedEdge.startX,
                    y: positionedEdge.startY
                },
                {
                    x: positionedEdge.midX,
                    y: positionedEdge.midY
                },
                {
                    x: positionedEdge.endX,
                    y: positionedEdge.endY
                }
            ];
        }
    });
    log2.debug("Inserting and positioning edges");
    await Promise.all(data4Layout.edges.map(async (edge)=>{
        const _edgeLabel = await insertEdgeLabel(edgeLabels, edge);
        const startNode = nodeDb[edge.start ?? ""];
        const endNode = nodeDb[edge.end ?? ""];
        if (startNode && endNode) {
            const positionedEdge = layoutResult.edges.find((e)=>e.id === edge.id);
            if (positionedEdge) {
                log2.debug("APA01 positionedEdge", positionedEdge);
                const edgeWithPath = {
                    ...edge
                };
                const paths = insertEdge(edgePaths, edgeWithPath, clusterDb, data4Layout.type, startNode, endNode, data4Layout.diagramId);
                positionEdgeLabel(edgeWithPath, paths);
            } else {
                const edgeWithPath = {
                    ...edge,
                    points: [
                        {
                            x: startNode.x || 0,
                            y: startNode.y || 0
                        },
                        {
                            x: endNode.x || 0,
                            y: endNode.y || 0
                        }
                    ]
                };
                const paths = insertEdge(edgePaths, edgeWithPath, clusterDb, data4Layout.type, startNode, endNode, data4Layout.diagramId);
                positionEdgeLabel(edgeWithPath, paths);
            }
        }
    }));
    log2.debug("Cose-bilkent rendering completed");
}, "render");
// src/rendering-util/layout-algorithms/cose-bilkent/index.ts
var render2 = render;
;
}),
]);

//# sourceMappingURL=19xk_1ckf6ma._.js.map