class CaveWindow extends BottomTabbedPopup
{
    layerName = "caveWindow"; // Used as key in activeLayers
    domElementId = "CAVESYSTEMD"; // ID of dom element that gets shown or hidden
    context = CAVESYSTEM;         // Canvas rendering context for popup
    frameWidthFraction = 0.0325;
    frameHeightFraction = 0.0425;
    frameRightShadowFraction = 0.01;
    frameBottomShadowFraction = 0.05;
    caveHolderWidthCoefficient = 4;
    caveSystem;
    caveNode;
    caveHolderScroller;
    cachedCaveBackground;
    colorPalette;

    droneListBarHeightFraction = 0.15;

    tipDisplay;
    displayedTip = "";

    nodeWidth = 25;

    selectedPath;

    isTutorialActive = false;

    constructor(boundingBox, caveWorldDepth)
    {
        super(boundingBox);
        if(!boundingBox)
        {
            this.setBoundingBox();
        }

        if (typeof(xmasFrame) != "undefined")
        {
            this.topFrameImage = xmasFrame;
            this.backgroundImage = snowBG;
        }

        this.initializeTabs([]);

        // DEBUG
        this.caveSystem = getCaveAtDepth(caveWorldDepth);

        this.initializeCaveDisplay();
        // this.initializeTipDisplay();
        this.initializeDroneList();
        this.initializeDroneMenu();
        this.setColorPalette();
        if(worldAtDepth(caveWorldDepth).index == 0)
        {
            this.popupFrameImage = caveFrame;
        }
        else if(worldAtDepth(caveWorldDepth).index == 1)
        {
            this.popupFrameImage = moonCaveFrame;
        }
    }

    open()
    {
        super.open();
        if (!hasSeenCaveTutorial)
        {
            this.startCaveTutorial();
        }
    }

    close()
    {
        if (dialogueManager.compareDialogueId("caveTutorial"))
        {
            dialogueManager.hide();
        }
        return super.close();
    }

    render()
    {
        if(!this.caveSystem.isActive)
        {
            closeUi(this);
        }
        if(this.selectedPath && !this.droneMenu.isVisible())
        {
            this.selectedPath = null;
        }
        this.context.save();
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        this.context.restore();
        super.render();
        this.caveHolderScroller.renderChildren();
        if(this.droneListPane.isVisible())
        {
            this.droneListPane.render();
            this.renderDroneList();
        }
        if(this.droneMenu.isVisible())
        {
            this.context.save();
            // this.context.imageSmoothingEnabled = false;
            this.droneMenu.render();
            this.context.restore();
        }
    }

    onTabChange()
    {
        this.droneMenu.hide();
    }

    initializeCaveDisplay()
    {
        this.caveHolderScroller = new HorizontalDraggableScrollbox(
            this.bodyContainer.boundingBox.width * 10,
            this.bodyContainer.boundingBox.height * (1 - this.droneListBarHeightFraction) - 15,
            this.context,
            this.bodyContainer.boundingBox.x,
            this.bodyContainer.boundingBox.y,
            this.bodyContainer.boundingBox.width,
            this.bodyContainer.boundingBox.height * (1 - this.droneListBarHeightFraction),
            15
        );
        // this.caveHolderScroller.context.imageSmoothingEnabled = false;
        this.caveHolderScroller.id = "CaveHolderScroller";
        this.caveHolderScroller.contentWidth = Math.max(
            this.bodyContainer.boundingBox.width * this.caveHolderWidthCoefficient * (this.caveSystem.caveTreeDepth / 25),
            this.bodyContainer.boundingBox.width
        );
        this.caveHolderScroller.initializeScrollbar();

        this.caveHolderScroller.postRender = function ()
        {
            this.parent.droneListPane.render();
            if (this.parent.droneListScrollbox.isVisible())
            {
                this.parent.droneListScrollbox.render();
            }
            if(this.parent.droneMenu.isVisible())
            {
                this.parent.droneMenu.render();
            }
        };

        var caveHolder = new Hitbox(
            {
                x: 0,
                y: 0,
                width: this.caveHolderScroller.contentWidth,
                height: this.caveHolderScroller.contentHeight
            },
            {},
            "",
            "caveHolder"
        );

        var nodesInSystem = this.caveSystem.getAllChildNodesFromRoot();
        for(var i = 0; i < nodesInSystem.length; i++)
        {
            var nodeHorizontalSpace = caveHolder.boundingBox.width - this.nodeWidth;
            var nodeVerticalSpace = caveHolder.boundingBox.height - this.nodeWidth;
            // Clamp node positions to fit in window
            // DP: Need to change this so nodes don't clump up at the end
            // nodesInSystem[i].x = Math.max(0, Math.min(nodeHorizontalSpace - this.nodeWidth, nodesInSystem[i].x * nodeHorizontalSpace + this.nodeWidth / 2)) / nodeHorizontalSpace;
            // nodesInSystem[i].y = Math.max(0, Math.min(nodeVerticalSpace - this.nodeWidth, nodesInSystem[i].y * nodeVerticalSpace + this.nodeWidth / 2)) / nodeVerticalSpace;

            var caveNode = new Hitbox(
                {
                    x: (nodesInSystem[i].x * nodeHorizontalSpace),
                    y: (nodesInSystem[i].y * nodeVerticalSpace),
                    width: this.nodeWidth,
                    height: this.nodeWidth
                },
                {},
                "pointer",
                "caveNode_" + nodesInSystem[i].id
            );
            caveNode.caveWindow = this;
            caveNode.node = nodesInSystem[i];

            caveNode.onmousedown = function ()
            {
                if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                this.caveWindow.caveNode = this.node;
                this.caveWindow.selectedPath = this.caveWindow.caveSystem.getPathToNode(this.node);
                var nodeCoords = this.getRelativeCoordinates(0, 0, this.caveWindow);
                this.caveWindow.droneMenu.selectedBlueprint = null;
                this.caveWindow.droneMenu.readyToSendDrone = false;
                this.caveWindow.droneMenu.show(nodeCoords.x + this.boundingBox.width, nodeCoords.y + this.boundingBox.height);
                hideTooltip();
                if (this.caveWindow.isTutorialAtStep("selectNode"))
                {
                    dialogueManager.next("caveTutorial");
                }
            }

            caveNode.render = function (parentWindow)
            {
                var context = this.caveWindow.caveHolderScroller.context;
                var relativeCoords = this.getRelativeCoordinates(0, 0, this.parent);
                var nodeRewards = this.caveWindow.caveSystem.getRewardsOnNode(this.node);
                var nodeIcon = this.node.getIcon();
                context.save();
                if(this.node.isRevealed)
                {
                    context.fillStyle = this.caveWindow.colorPalette.revealed;
                    context.beginPath();
                    context.arc(
                        relativeCoords.x + this.boundingBox.width / 2,
                        relativeCoords.y + this.boundingBox.height / 2,
                        5,
                        0,
                        2 * Math.PI
                    );
                    context.fill();
                    if(this.node.affectingDrone && this.node.affectingDrone.isAlive)
                    {
                        parentWindow.caveHolderScroller.context.lineWidth = 5;
                        parentWindow.caveHolderScroller.context.strokeStyle = this.node.effectColor;
                        parentWindow.caveHolderScroller.context.globalAlpha = 0.1 + 0.15 * oscillate(numFramesRendered, 48);
                        parentWindow.caveHolderScroller.context.stroke();
                        parentWindow.caveHolderScroller.context.globalAlpha = 1;
                    }
                    if(nodeIcon)
                    {
                        drawImageFitInBox(
                            context,
                            nodeIcon,
                            relativeCoords.x + this.boundingBox.width * 0.05,
                            relativeCoords.y + this.boundingBox.height * 0.05,
                            this.boundingBox.width,
                            this.boundingBox.height
                        );
                    }
                    for(var i = nodeRewards.length - 1; i >= 0; --i)
                    {
                        if(nodeRewards[i].distanceFromNode > 0 && nodeRewards[i].isClaimed)
                        {
                            var node = this.node.parent;
                            var childNode = this.node;
                            var grandparentY = node.y;
                            if(node.parent != null)
                            {
                                grandparentY = node.parent.y;
                            }

                            var parentX = node.x;
                            var parentY = node.y;
                            var childX = childNode.x;
                            var childY = childNode.y;
                            var childYDelta = childY - parentY;
                            var parentYDelta = grandparentY - parentY;

                            var curveControlPoint1X = node.x + (.25 / parentWindow.caveSystem.caveTreeDepth);
                            var curveControlPoint1Y = parentY - (parentYDelta * .25);
                            var curveControlPoint2X = node.x + (.75 / parentWindow.caveSystem.caveTreeDepth);
                            var curveControlPoint2Y = childY - (childYDelta * .25);

                            var rewardPoint = getBezierXY(
                                nodeRewards[i].distanceFromNode,
                                (parentX * nodeHorizontalSpace),
                                (parentY * nodeVerticalSpace),
                                (curveControlPoint1X * nodeHorizontalSpace),
                                (curveControlPoint1Y * nodeVerticalSpace),
                                (curveControlPoint2X * nodeHorizontalSpace),
                                (curveControlPoint2Y * nodeVerticalSpace),
                                (childX * nodeHorizontalSpace),
                                (childY * nodeVerticalSpace)
                            );
                            drawImageFitInBox(
                                context,
                                nodeRewards[0].icon,
                                rewardPoint.x + this.boundingBox.width * 0.05,
                                rewardPoint.y + this.boundingBox.height * 0.05,
                                this.boundingBox.width,
                                this.boundingBox.height
                            );
                            nodeRewards.splice(i, 1);
                        }
                    }
                    if(nodeRewards.length > 0)
                    {
                        drawImageFitInBox(
                            context,
                            nodeRewards[0].icon,
                            relativeCoords.x + this.boundingBox.width * 0.05,
                            relativeCoords.y + this.boundingBox.height * 0.05,
                            this.boundingBox.width,
                            this.boundingBox.height
                        );
                        if(nodeRewards.length > 1)
                        {
                            context.font = "24px KanitB";
                            context.fillStyle = "#5EB65D";
                            context.strokeStyle = "#000000";
                            context.lineWidth = 2;
                            context.textBaseline = "middle";
                            context.strokeText(
                                "+",
                                relativeCoords.x + this.boundingBox.width - 8,
                                relativeCoords.y + this.boundingBox.height - 4
                            );
                            context.fillText(
                                "+",
                                relativeCoords.x + this.boundingBox.width - 8,
                                relativeCoords.y + this.boundingBox.height - 4
                            );
                        }
                    }
                }
                else
                {
                    var questionMarkWidth = this.boundingBox.width * 0.6;
                    drawImageFitInBox(
                        context,
                        parentWindow.colorPalette.questionMark,
                        relativeCoords.x + (this.boundingBox.width - questionMarkWidth) / 2 + this.boundingBox.width * 0.05,
                        relativeCoords.y + (this.boundingBox.height - questionMarkWidth) / 2 + this.boundingBox.height * 0.05,
                        questionMarkWidth,
                        questionMarkWidth
                    );
                }
                context.restore();
                this.renderChildren();
            }.bind(caveNode, this);

            caveNode.isEnabled = () => !this.isTutorialActive || !this.isTutorialAtStep(["caveIntro1", "caveIntro2"]);

            caveHolder.addHitbox(caveNode);

            var hintHighlight = new EasyHintHighlight();
            hintHighlight.isVisible = function (parentWindow, node)
            {
                if(!parentWindow.droneMenu.isVisible())
                {
                    this.highlightColor = "#76E374";
                    if (parentWindow.isTutorialAtStep("selectNode") && node.depth > 0)
                    {
                        this.highlightColor = "#FEFF37";
                        return true;
                    }
                }
                else if(node == parentWindow.caveNode)
                {
                    this.highlightColor = "#E37476";
                    return true;
                }
                return false;
            }.bind(hintHighlight, this, caveNode.node)
            hintHighlight.root = caveHolder;
            hintHighlight.rootContext = this.caveHolderScroller.context;
            hintHighlight.isCircle = true;
            hintHighlight.sizeReduction = 4;
            caveNode.addHitbox(hintHighlight);

            if(caveNode.node.children.length == 0 || (caveNode.node.isRevealed && this.caveSystem.getRewardsOnNode(caveNode.node).length > 0))
            {
            }
        }
        caveHolder.isFirstPass = true;

        caveHolder.render = function (parent)
        {
            var context = parent.caveHolderScroller.context;
            context.save();
            if(this.isFirstPass)
            {
                context.save();
                if(parent.caveSystem.kmDepth <= 1000)
                {
                    var caveBackgroundImage = caveBgLight;
                    var tunnelBackgroundImage = caveBgDark;
                }
                else
                {
                    var caveBackgroundImage = moonCaveBgLight;
                    var tunnelBackgroundImage = moonCaveBgDark;
                }
                // Render wide tunnels
                context.lineWidth = 25;
                context.strokeStyle = "#000000";
                context.lineCap = "round";
                this.renderTree(parent.caveSystem.rootNode, parent);
                // Draw background inside tunnels
                context.globalCompositeOperation = "source-atop";
                drawTiledImage(context, tunnelBackgroundImage, 0, 0, this.boundingBox.width, this.boundingBox.height, tunnelBackgroundImage.width / 2, tunnelBackgroundImage.height / 2);
                // Redraw tunnels for edge highlights
                context.globalCompositeOperation = "source-over";
                context.shadowColor = parent.colorPalette.tunnelEdge;
                context.shadowBlur = 4;
                context.drawImage(context.canvas, 0, 0);
                // Render background
                context.shadowBlur = 0;
                context.globalCompositeOperation = "destination-over";
                drawTiledImage(context, caveBackgroundImage, 0, 0, this.boundingBox.width, this.boundingBox.height, caveBackgroundImage.width, caveBackgroundImage.height);
                this.cachedCaveBackground = new Image();
                this.cachedCaveBackground.src = context.canvas.toDataURL();
                context.restore();
            }
            else
            {
                context.drawImage(this.cachedCaveBackground, 0, 0);
            }
            context.fillStyle = parent.colorPalette.revealed;
            context.strokeStyle = parent.colorPalette.revealed;
            context.lineWidth = 1;
            this.renderTree(parent.caveSystem.rootNode, parent);
            this.renderChildren();
            context.fillStyle = "#00FF00";
            this.renderDrones(parent);
            context.restore();
            this.isFirstPass = false;
        }.bind(caveHolder, this);

        caveHolder.renderTree = function (node, parent)
        {
            var relativeCoords = {x: parent.nodeWidth / 2, y: parent.nodeWidth / 2};

            var nodeVerticalSpace = this.boundingBox.height - parent.nodeWidth;
            var nodeHorizontalSpace = this.boundingBox.width - parent.nodeWidth;

            for(var i = 0; i < node.children.length; i++)
            {
                parent.caveHolderScroller.context.save();
                var childNode = node.children[i];
                parent.caveHolderScroller.context.strokeStyle = childNode.isRevealed ? parent.colorPalette.revealed : parent.colorPalette.hidden;

                var grandparentY = node.y;
                if(node.parent != null)
                {
                    grandparentY = node.parent.y;
                }
                var parentX = node.x;
                var parentY = node.y;
                var childX = childNode.x;
                var childY = childNode.y;
                var childYDelta = childY - parentY;
                var parentYDelta = grandparentY - parentY;

                var curveControlPoint1X = node.x + (.25 / parent.caveSystem.caveTreeDepth);
                var curveControlPoint1Y = parentY - (parentYDelta * .25);
                var curveControlPoint2X = node.x + (.75 / parent.caveSystem.caveTreeDepth);
                var curveControlPoint2Y = childY - (childYDelta * .25);

                parent.caveHolderScroller.context.beginPath();
                parent.caveHolderScroller.context.moveTo(
                    relativeCoords.x + (parentX * nodeHorizontalSpace),
                    relativeCoords.y + (parentY * nodeVerticalSpace)
                );
                parent.caveHolderScroller.context.bezierCurveTo(
                    (relativeCoords.x + (curveControlPoint1X * nodeHorizontalSpace)),
                    (relativeCoords.y + (curveControlPoint1Y * nodeVerticalSpace)),
                    (relativeCoords.x + (curveControlPoint2X * nodeHorizontalSpace)),
                    (relativeCoords.y + (curveControlPoint2Y * nodeVerticalSpace)),
                    (relativeCoords.x + (childX * nodeHorizontalSpace)),
                    (relativeCoords.y + (childY * nodeVerticalSpace))
                );
                if(parent.caveNode != null && parent.caveNode.id.indexOf(childNode.id) == 0 && parent.droneMenu.isVisible())
                {
                    var phaseShift = -3 * node.depth;
                    parent.caveHolderScroller.context.strokeStyle = rgbToHex(80 + oscillate(numFramesRendered + phaseShift, 24) * 175, 90, 90);
                }
                if(parent.highlightedDrone != null)
                {
                    var lastNode = parent.highlightedDrone.nodePath[parent.highlightedDrone.lastReachedNodeIndex];
                    var endNode = parent.highlightedDrone.nodePath[parent.highlightedDrone.nodePath.length - 1];
                    if(endNode.id.indexOf(childNode.id) == 0 &&
                        ((parent.highlightedDrone.isMovingForward && node.depth >= lastNode.depth) ||
                            (!parent.highlightedDrone.isMovingForward && node.depth < lastNode.depth)))
                    {
                        var phaseShift = parent.highlightedDrone.isMovingForward ? -3 * node.depth : 3 * node.depth;
                        parent.caveHolderScroller.context.strokeStyle = rgbToHex(70, 55 + oscillate(numFramesRendered + phaseShift, 24) * 200, 70);
                    }
                }
                parent.caveHolderScroller.context.stroke();

                // Special effects (e.g., healing drone range outline)
                if(node.affectingDrone && node.affectingDrone.isAlive && childNode.affectingDrone && childNode.affectingDrone.isAlive && node.effectColor == childNode.effectColor)
                {
                    parent.caveHolderScroller.context.lineWidth = 5;
                    parent.caveHolderScroller.context.strokeStyle = node.effectColor;
                    parent.caveHolderScroller.context.globalAlpha = 0.1 + 0.2 * oscillate(numFramesRendered, 48);
                    parent.caveHolderScroller.context.stroke();
                }

                parent.caveHolderScroller.context.restore();
                this.renderTree(childNode, parent);
            }
        }
        caveHolder.renderDrones = function (parent)
        {
            try
            {
                var context = parent.caveHolderScroller.context;
                var relativeCoords = {x: parent.nodeWidth / 2, y: parent.nodeWidth / 2};
                var nodeVerticalSpace = this.boundingBox.height - parent.nodeWidth;
                var nodeHorizontalSpace = this.boundingBox.width - parent.nodeWidth;

                for(var i = 0; i < parent.caveSystem.activeDrones.length; i++)
                {
                    var activeDrone = parent.caveSystem.activeDrones[i];
                    activeDrone.logStatus = false;

                    var node = activeDrone.nodePath[activeDrone.lastReachedNodeIndex];
                    var childNode = activeDrone.nodePath[activeDrone.lastReachedNodeIndex];
                    var progressToNextNode = activeDrone.progressToNextNode;
                    if(activeDrone.isMovingForward)
                    {
                        if(activeDrone.nodePath.length > 1 && activeDrone.nodePath.length > activeDrone.lastReachedNodeIndex)
                        {
                            childNode = activeDrone.nodePath[activeDrone.nextNodeIndex()];
                        }
                    }
                    else
                    {
                        node = activeDrone.nodePath[activeDrone.nextNodeIndex()];
                        progressToNextNode = 1 - activeDrone.progressToNextNode;
                    }

                    var grandparentY = node.y;
                    if(node.parent != null)
                    {
                        grandparentY = node.parent.y;
                    }

                    var parentX = node.x;
                    var parentY = node.y;
                    var childX = childNode.x;
                    var childY = childNode.y;
                    var childYDelta = childY - parentY;
                    var parentYDelta = grandparentY - parentY;

                    var curveControlPoint1X = node.x + (.25 / parent.caveSystem.caveTreeDepth);
                    var curveControlPoint1Y = parentY - (parentYDelta * .25);
                    var curveControlPoint2X = node.x + (.75 / parent.caveSystem.caveTreeDepth);
                    var curveControlPoint2Y = childY - (childYDelta * .25);

                    var dronePoint = getBezierXY(
                        progressToNextNode,
                        (relativeCoords.x + (parentX * nodeHorizontalSpace)),
                        (relativeCoords.y + (parentY * nodeVerticalSpace)),
                        (relativeCoords.x + (curveControlPoint1X * nodeHorizontalSpace)),
                        (relativeCoords.y + (curveControlPoint1Y * nodeVerticalSpace)),
                        (relativeCoords.x + (curveControlPoint2X * nodeHorizontalSpace)),
                        (relativeCoords.y + (curveControlPoint2Y * nodeVerticalSpace)),
                        (relativeCoords.x + (childX * nodeHorizontalSpace)),
                        (relativeCoords.y + (childY * nodeVerticalSpace))
                    );

                    var droneAngle = getBezierAngle(
                        progressToNextNode,
                        (relativeCoords.x + (parentX * nodeHorizontalSpace)),
                        (relativeCoords.y + (parentY * nodeVerticalSpace)),
                        (relativeCoords.x + (curveControlPoint1X * nodeHorizontalSpace)),
                        (relativeCoords.y + (curveControlPoint1Y * nodeVerticalSpace)),
                        (relativeCoords.x + (curveControlPoint2X * nodeHorizontalSpace)),
                        (relativeCoords.y + (curveControlPoint2Y * nodeVerticalSpace)),
                        (relativeCoords.x + (childX * nodeHorizontalSpace)),
                        (relativeCoords.y + (childY * nodeVerticalSpace))
                    );

                    context.save();

                    //getQuadraticAngle
                    // parent.context.fillRect(
                    //     dronePoint.x - 10,
                    //     dronePoint.y - 10,
                    //     20,
                    //     20
                    // );
                    parent.renderAnimatedDrone(
                        context,
                        activeDrone,
                        dronePoint.x - 10,
                        dronePoint.y - 10,
                        20,
                        20
                    );

                    //Render Health
                    context.fillStyle = "#000000";
                    context.fillRect(
                        dronePoint.x - 11,
                        dronePoint.y + 10,
                        20,
                        4
                    );
                    context.fillStyle = "#FF0000";
                    context.fillRect(
                        dronePoint.x - 10,
                        dronePoint.y + 11,
                        18 * (activeDrone.currentHealth / activeDrone.totalHealth),
                        2
                    );

                    //Render Fuel
                    context.fillStyle = "#000000";
                    context.fillRect(
                        dronePoint.x - 11,
                        dronePoint.y + 14,
                        20,
                        4
                    );
                    context.fillStyle = "#00ff00";
                    context.fillRect(
                        dronePoint.x - 10,
                        dronePoint.y + 15,
                        18 * (activeDrone.currentFuel / activeDrone.totalFuel),
                        2
                    );
                    context.restore();
                }
            }
            catch(e)
            {
                console.warn("Failed to render drone");
            }
        }
        caveHolder.allowBubbling = true;
        this.caveHolderScroller.addHitbox(caveHolder);
        this.addHitbox(this.caveHolderScroller);
    }

    initializeDroneMenu()
    {
        this.droneMenu = new MobileContextMenu(
            {x: 0, y: 0, width: this.boundingBox.width * 0.8, height: this.boundingBox.height * 0.8}
        )
        this.addHitbox(this.droneMenu);
        this.droneMenu.initialize();
        this.droneMenu.readyToSendDrone = false;
        this.droneMenu.onHide = function()
        {
            if (this.isTutorialAtStep([
                "nodeInfoExplanation",
                "dronesExplanation",
                "basicDroneExplanation",
                "magnetDroneExplanation",
                "flyingDroneExplanation",
                "selectDrone",
                "sendDrone"
            ]))
            {
                dialogueManager.goToEntryWithKey("selectNode", "caveTutorial");
            }
        }.bind(this);

        var container = this.droneMenu.bodyContainer;

        // CAVE NODE INFO SCREEN

        var infoTextbox = new Hitbox(
            {
                x: 0,
                y: 0,
                width: container.boundingBox.width,
                height: container.boundingBox.height
            },
            {},
            ""
        )
        infoTextbox.render = function()
        {
            var root = this.getRootLayer();
            var coords = this.getRelativeCoordinates(0, 0, root);
            root.context.save();
            root.context.textBaseline = "top";
            root.context.fillStyle = "#FFFFFF";
            root.context.strokeStyle = "#000000";
            root.context.lineWidth = 3;
            if(root.caveNode.isRevealed)
            {
                var rewardsOnNode = root.caveSystem.getRewardsOnNode(root.caveNode);
                var description = root.caveNode.description;
                if(rewardsOnNode.length > 0)
                {
                    if(description.length > 0) description += " \n ";
                    description += _("Treasure:") + root.getRewardsListFromArray(rewardsOnNode, " \n - ", true);
                }
                else if (description == "")
                {
                    description = _("An empty cave chamber");
                }
                var name = root.caveNode.name;
            }
            else
            {
                var description = _("Explore deeper in the cave to reveal this node");
                var name = "???";
            }
            root.context.font = "24px KanitB";
            outlineTextWrap(
                root.context,
                name,
                coords.x,
                coords.y,
                this.boundingBox.width,
                "center"
            )
            root.context.font = "18px KanitM";
            outlineTextWrap(
                root.context,
                description,
                coords.x,
                coords.y + 32,
                this.boundingBox.width,
                "left"
            );
            root.context.restore();
        }
        
        infoTextbox.isVisible = () => !this.droneMenu.readyToSendDrone;
        infoTextbox.isEnabled = () => !this.droneMenu.readyToSendDrone;
        container.addHitbox(infoTextbox);

        var selectDroneButton = this.droneMenu.bodyContainer.addHitbox(new Button(
            upgradeb, _("Select Drone"), "24px Verdana", "#000000",
            {
                x: this.droneMenu.bodyContainer.boundingBox.width * 0.2,
                y: this.droneMenu.bodyContainer.boundingBox.height * 0.85,
                width: this.droneMenu.bodyContainer.boundingBox.width * 0.6,
                height: this.droneMenu.bodyContainer.boundingBox.height * 0.2,
            },
            {
                onmousedown: function ()
                {
                    if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    this.droneMenu.readyToSendDrone = true;
                    if (this.isTutorialAtStep("nodeInfoExplanation"))
                    {
                        dialogueManager.next("caveTutorial");
                    }
                }.bind(this)
            }
        ));
        
        selectDroneButton.isVisible = () => !this.droneMenu.readyToSendDrone;
        selectDroneButton.isEnabled = () => !this.droneMenu.readyToSendDrone;

        var hintHighlight = selectDroneButton.addHitbox(new EasyHintHighlight(function(parentWindow) {
            return parentWindow.isTutorialAtStep("nodeInfoExplanation");
        }.bind(selectDroneButton, this)))
        hintHighlight.root = this;
        hintHighlight.rootContext = this.context;
        hintHighlight.sizeReduction = hintHighlight.lineWidth;
        hintHighlight.highlightColor = "#FEFF37";

        // DRONE SELECTION LIST

        var blueprintList = getKnownBlueprints();
        blueprintList = filterBlueprintsByCategory(blueprintList, craftingCategories.drones);
        var slotPadding = 12;
        var slotSize = Math.min(80, Math.floor(this.boundingBox.height * 0.2)) + slotPadding;
        var padding = 3;
        var slotsPerRow = Math.min(blueprintList.length, Math.floor((container.boundingBox.width - padding * 2) / slotSize));
        var totalRows = Math.ceil(blueprintList.length / slotsPerRow);
        var slotSpacing;
        if(slotsPerRow > 1)
        {
            slotSpacing = ((container.boundingBox.width - padding * 2) - (slotSize * slotsPerRow)) / (slotsPerRow - 1);
        }
        else
        {
            slotSpacing = 0;
        }
        slotSpacing = Math.min(slotSpacing, 10);
        var firstColumnX = container.boundingBox.width / 2 - (slotsPerRow * slotSize + (slotsPerRow - 1) * slotSpacing) / 2
        var firstRowY = container.boundingBox.height / 2 - (totalRows * slotSize + (totalRows - 1) * slotSpacing) / 2
        var textHitbox = new Hitbox(
            {
                x: 0,
                y: firstRowY / 2 - 8,
                width: container.boundingBox.width,
                height: 16
            },
            {}, ""
        )
        textHitbox.render = function ()
        {
            var root = this.getRootLayer();
            var coords = this.getRelativeCoordinates(0, 0, root);
            root.context.save();
            root.context.font = "24px KanitM";
            root.context.textBaseline = "middle";
            root.context.fillStyle = "#FFFFFF";
            root.context.strokeStyle = "#000000";
            root.context.lineWidth = 3;
            outlineTextWrap(
                root.context,
                _("Select a drone to send"),
                coords.x,
                coords.y,
                this.boundingBox.width,
                "center"
            );
            root.context.restore();
        };
        textHitbox.isVisible = () => this.droneMenu.readyToSendDrone && this.droneMenu.selectedBlueprint == null;
        container.addHitbox(textHitbox);
        for(var i = 0; i < blueprintList.length; ++i)
        {
            var blueprint = blueprintList[i];
            if(!blueprint) continue;
            var indexInRow = i % slotsPerRow;
            var slotX = firstColumnX + indexInRow * (slotSize + slotSpacing);
            var slotY = firstRowY + Math.floor(i / slotsPerRow) * (slotSize + slotSpacing);
            var itemHitbox = new Hitbox(
                {
                    x: slotX,
                    y: slotY,
                    width: slotSize,
                    height: slotSize
                },
                {
                    onmousedown: function (blueprint)
                    {
                        this.droneMenu.selectedBlueprint = blueprint;
                        this.selectedBlueprint = blueprint;
                        this.droneMenu.selectedDrone = getDroneById(blueprint.craftedItem.item.id);
                        this.discountedIngredients = this.getIngredientListWithDiscounts(blueprint.ingredients);
                        if (this.isTutorialAtStep("dronesExplanation"))
                        {
                            dialogueManager.next("caveTutorial");
                        }
                    }.bind(this, blueprint)
                },
                "pointer"
            );
            itemHitbox.render = function (root, blueprint)
            {
                var coords = this.getRelativeCoordinates(0, 0, root);
                root.context.save();
                root.context.globalAlpha = 0.5;
                root.context.fillStyle = "#000000";
                root.context.fillRect(
                    coords.x,
                    coords.y,
                    this.boundingBox.width,
                    this.boundingBox.height
                );
                root.context.restore();
                drawImageFitInBox(
                    root.context,
                    blueprint.craftedItem.item.getIcon(),
                    coords.x + slotPadding / 2,
                    coords.y + slotPadding / 2,
                    this.boundingBox.width - slotPadding,
                    this.boundingBox.height - slotPadding
                );
                root.context.drawImage(
                    itemFrame,
                    coords.x,
                    coords.y,
                    this.boundingBox.width,
                    this.boundingBox.height
                );
                this.renderChildren();
            }.bind(itemHitbox, this.getRootLayer(), blueprint);

            itemHitbox.isVisible = () => this.droneMenu.readyToSendDrone && this.droneMenu.selectedBlueprint == null;
            itemHitbox.isEnabled = function(i) {
                return !(i > 0 && this.isTutorialAtStep("dronesExplanation")) && 
                    this.droneMenu.readyToSendDrone && 
                    this.droneMenu.selectedBlueprint == null;
            }.bind(this, i);
            container.addHitbox(itemHitbox, true);

            var hintHighlight = new EasyHintHighlight();
            hintHighlight.isVisible = function (parentWindow, i)
            {
                if (i == 0 && parentWindow.isTutorialAtStep("dronesExplanation"))
                {
                    this.highlightColor = "#FEFF37";
                    return true
                }
                return false;
            }.bind(hintHighlight, this, i)
            itemHitbox.addHitbox(hintHighlight);
            this.initializeDroneCraftingScreen();
        }
        this.droneMenu.hide();
    }

    craftDrone(droneBlueprintId)
    {
        if(this.selectedPath)
        {
            var blueprint = getBlueprintById(craftingCategories.drones, droneBlueprintId);
            var drone = getDroneById(blueprint.craftedItem.item.id);
            this.caveSystem.startDroneOnPath(drone, this.selectedPath)
        }
    }

    initializeTipDisplay()
    {
        this.tipDisplay = new Hitbox(
            {
                x: 0,
                y: this.bodyContainer.boundingBox.height * 0.7,
                width: this.bodyContainer.boundingBox.width,
                height: this.bodyContainer.boundingBox.height * 0.03
            },
            {},
            "",
            "tipDisplay"
        );
        this.tipDisplay.render = function (parentWindow)
        {
            var coords = this.getRelativeCoordinates(0, 0, parentWindow);
            var tipDurationSeconds = 20;
            if(parentWindow.displayedTip == "" || numFramesRendered % (tipDurationSeconds / 0.1) == 0)
            {
                var newTip = caveTips[rand(0, caveTips.length - 1)];
                while(newTip == parentWindow.displayedTip)
                {
                    newTip = caveTips[rand(0, caveTips.length - 1)];
                }
                parentWindow.displayedTip = newTip;
            }
            parentWindow.context.save();
            parentWindow.context.fillStyle = "#FFFFFF";
            parentWindow.context.strokeStyle = "#000000";
            parentWindow.context.lineWidth = 3;
            parentWindow.context.textBaseline = "ideographic";
            parentWindow.context.font = "13px Verdana";
            strokeTextShrinkToFit(
                parentWindow.context,
                _(parentWindow.displayedTip),
                coords.x,
                coords.y + this.boundingBox.height,
                this.boundingBox.width,
                "center"
            )
            fillTextShrinkToFit(
                parentWindow.context,
                _(parentWindow.displayedTip),
                coords.x,
                coords.y + this.boundingBox.height,
                this.boundingBox.width,
                "center"
            )
        }.bind(this.tipDisplay, this);
        this.bodyContainer.addHitbox(this.tipDisplay);
    }

    initializeDroneList()
    {
        this.droneListPane = new Hitbox(
            {
                x: this.bodyContainer.boundingBox.x,
                y: this.boundingBox.height - (this.bodyContainer.boundingBox.height * this.droneListBarHeightFraction),
                width: this.bodyContainer.boundingBox.width + 15,
                height: this.bodyContainer.boundingBox.height * 0.5,
            },
            {},
            "",
            "droneListPane"
        );
        this.addHitbox(this.droneListPane);

        this.droneListBar = new Hitbox(
            {
                x: 0,
                y: 0,
                width: this.bodyContainer.boundingBox.width,
                height: this.bodyContainer.boundingBox.height * this.droneListBarHeightFraction,
            },
            {},
            "pointer",
            "droneListBar"
        )
        this.droneListBar.onmousedown = function(parent, droneListPane)
        {
            if (droneListPane.boundingBox.y == parent.boundingBox.height * 0.5)
            {
                droneListPane.boundingBox.y = parent.boundingBox.height - parent.droneListBar.boundingBox.height;
                parent.droneListScrollbox.isCollapsed = true;
                parent.renderDroneList();
            }
            else
            {
                droneListPane.boundingBox.y = parent.boundingBox.height * 0.5;
                parent.droneListScrollbox.isCollapsed = false;
                parent.renderDroneList();
                if (parent.isTutorialAtStep("expandDroneList"))
                {
                    dialogueManager.next("caveTutorial");
                }
            }
        }.bind(this.droneListBar, this, this.droneListPane)
        this.droneListBar.render = function()
        {
            var root = this.getRootLayer();
            var context = root.context;
            var coords = this.getRelativeCoordinates(0, 0, root);
            context.save();
            // context.imageSmoothingEnabled = false;
            var barHeight = this.boundingBox.height;
            var fuelBarWidth = root.boundingBox.width * 0.2;
            var fuelBarHeight = barHeight * 0.85;
            var lineYCoordinate = coords.y + 2;
            context.drawImage(root.backgroundImage, coords.x, coords.y, this.boundingBox.width, this.boundingBox.height);
            renderFancyProgressBar(
                context,
                _("Time Remaining: {0}", formattedCountDown(root.caveSystem.remainingSeconds)),
                root.caveSystem.remainingSeconds / root.caveSystem.totalDuration,
                root.bodyContainer.boundingBox.width - 2 * fuelBarWidth,
                lineYCoordinate,
                fuelBarWidth * 2,
                barHeight,
                "#7F7F7F",
                "#000000",
                "#FFFFFF",
                timerFrame
            );
            renderFancyProgressBar(
                context,
                _("Fuel: {0}/{1}", Math.floor(root.caveSystem.currentFuel), caveMaxFuelStructure.statValueForCurrentLevel()),
                root.caveSystem.currentFuel / caveMaxFuelStructure.statValueForCurrentLevel(),
                0,
                lineYCoordinate,
                fuelBarWidth * 2,
                barHeight,
                "#5EB65D",
                "#000000",
                "#FFFFFF",
                timerFrame
            );
            context.strokeStyle = "#BBBBBB";
            context.lineWidth = 4;
            context.lineCap = "round";
            var arrowTop = lineYCoordinate + this.boundingBox.height * (root.droneListScrollbox.isCollapsed ? 0.4 : 0.6);
            var arrowBottom = lineYCoordinate + this.boundingBox.height * (root.droneListScrollbox.isCollapsed ? 0.6 : 0.4);
            context.beginPath();
            context.moveTo(this.boundingBox.width * 0.5, arrowTop);
            context.lineTo(this.boundingBox.width * 0.45, arrowBottom);
            context.moveTo(this.boundingBox.width * 0.5, arrowTop);
            context.lineTo(this.boundingBox.width * 0.55, arrowBottom);
            context.stroke();
            context.restore();
            this.renderChildren();
        }

        var hintHighlight = this.droneListBar.addHitbox(new HintHighlight(
            {
                x: this.boundingBox.width * 0.6,
                y: 2,
                width: this.boundingBox.width * 0.4,
                height: this.droneListBar.boundingBox.height
            }
        ));
        hintHighlight.isVisible = function()
        {
            return this.isTutorialAtStep("timeExplanation");
        }.bind(this);
        hintHighlight.highlightColor = "#FEFF37";

        this.droneListBar.addHitbox(new EasyHintArrow(
            "down",
            function()
            {
                return this.isTutorialAtStep("timeExplanation");
            }.bind(this),
            0,
            this.boundingBox.width * 0.3
        ))

        hintHighlight = this.droneListBar.addHitbox(new HintHighlight(
            {
                x: 0,
                y: 2,
                width: this.boundingBox.width * 0.4,
                height: this.droneListBar.boundingBox.height
            }
        ));
        hintHighlight.isVisible = function()
        {
            return this.isTutorialAtStep("fuelExplanation");
        }.bind(this);
        hintHighlight.highlightColor = "#FEFF37";

        this.droneListBar.addHitbox(new EasyHintArrow(
            "down",
            function()
            {
                return this.isTutorialAtStep("fuelExplanation");
            }.bind(this),
            0,
            this.boundingBox.width * -0.3
        ));

        hintHighlight = this.droneListBar.addHitbox(new HintHighlight(
            {
                x: 0,
                y: 2,
                width: this.boundingBox.width,
                height: this.droneListBar.boundingBox.height
            }
        ));
        hintHighlight.isVisible = function()
        {
            return this.isTutorialAtStep("expandDroneList");
        }.bind(this);
        hintHighlight.highlightColor = "#FEFF37";

        this.droneListPane.addHitbox(this.droneListBar);

        this.droneListScrollbox = new DraggableScrollbox(
            this.bodyContainer.boundingBox.width,
            0,
            this.context,
            0,
            this.boundingBox.height * 0.5 + this.droneListBar.boundingBox.height - 1,
            this.bodyContainer.boundingBox.width + 15,
            this.boundingBox.height * 0.5 - this.droneListBar.boundingBox.height + 2,
            15,
        );
        this.droneListScrollbox.id = "droneListScrollbox";
        this.droneListScrollbox.allowBubbling = true;
        this.droneListScrollbox.context.imageSmoothingEnabled = true;
        this.droneListScrollbox.isCollapsed = true;
        this.droneListScrollbox.isEnabled = () => !this.droneListScrollbox.isCollapsed;
        this.droneListScrollbox.isVisible = () => !this.droneListScrollbox.isCollapsed;
        this.addHitbox(this.droneListScrollbox);
        for(var i = 0; i < 20; ++i)
        {
            var droneDisplayHitbox = new Hitbox(
                {
                    x: 0,
                    y: (2 + this.droneListScrollbox.boundingBox.height * 0.015) + (i + 1) * this.droneListScrollbox.boundingBox.height * 0.2,
                    width: this.droneListScrollbox.boundingBox.width,
                    height: this.droneListScrollbox.boundingBox.height * 0.2,
                },
                {
                    onmousedown: function (i)
                    {
                        if(i < this.caveSystem.activeDrones.length)
                        {
                            var drone = this.caveSystem.activeDrones[i];
                            var node = drone.nodePath[drone.lastReachedNodeIndex];
                            var relativePosition = (node.depth / this.caveSystem.caveTreeDepth) - (this.boundingBox.width / this.caveHolderScroller.contentWidth) / 2;
                            var scrollPosition = relativePosition * this.caveHolderScroller.contentWidth;
                            this.caveHolderScroller.scrollTo(scrollPosition);
                        }
                    }.bind(this, i),
                    onmouseenter: function (i)
                    {
                        if(i < this.caveSystem.activeDrones.length)
                        {
                            this.highlightedDrone = this.caveSystem.activeDrones[i];
                        }
                    }.bind(this, i),
                    onmouseexit: function ()
                    {
                        this.highlightedDrone = null;
                    }.bind(this)
                },
                "pointer"
            );
            droneDisplayHitbox.isEnabled = function (i) {return i < this.caveSystem.activeDrones.length;}.bind(this, i);
            this.droneListScrollbox.addHitbox(droneDisplayHitbox);
        }
    }

    initializeDroneCraftingScreen()
    {
        var xPadding = 5;
        var yPadding = 5;
        var iconSize = Math.min(25, Math.ceil(this.boundingBox.height * 0.128));
        var titleBoxPadding = iconSize / 10;
        var blueprintNameBox = new Hitbox(
            {
                x: 0,
                y: 0,
                width: this.droneMenu.bodyContainer.boundingBox.width,
                height: iconSize + 2 * titleBoxPadding
            },
            {},
            "",
            "blueprintNameBox"
        );
        blueprintNameBox.render = function (parentWindow)
        {
            var context = parentWindow.getContext();
            var relativeCoords = this.getRelativeCoordinates(0, 0, parentWindow);
            context.save();
            context.globalAlpha = 0.6;
            context.fillStyle = "#111111";
            context.fillRect(relativeCoords.x, relativeCoords.y, this.boundingBox.width, this.boundingBox.height);
            context.globalAlpha = 1;
            var fontSize = Math.floor(this.boundingBox.height * 0.95); 
            context.font = fontSize + "px KanitM";
            context.fillStyle = "#FFFFFF";
            context.textBaseline = "top";
            fillTextWrap(
                context,
                parentWindow.droneMenu.selectedBlueprint.craftedItem.item.getName(),
                relativeCoords.x + titleBoxPadding,
                relativeCoords.y + titleBoxPadding,
                this.boundingBox.width - titleBoxPadding * 2,
                "left",
                0.25
            );
            context.restore();
            this.renderChildren();
        }.bind(blueprintNameBox, this);
        var blueprintIcon = new Hitbox(
            {
                x: this.droneMenu.bodyContainer.boundingBox.width - iconSize * 3 - titleBoxPadding,
                y: iconSize + 3 * titleBoxPadding,
                width: iconSize * 3,
                height: iconSize * 3
            },
            {
                onmouseenter: function (blueprint, x, y)
                {
                    var coords = this.getGlobalCoordinates(x, y);
                    var rawIngredients = getRawIngredientsForBlueprint(blueprint);
                    var ingredientsString = _("Requires") + ":<br>";
                    for(var i in rawIngredients)
                    {
                        ingredientsString += i + ": " + rawIngredients[i] + "<br>";
                    }
                }.bind(blueprintNameBox, this.droneMenu.selectedBlueprint, titleBoxPadding, titleBoxPadding + iconSize),
                onmouseexit: function ()
                {
                    hideTooltip();
                }
            },
            "pointer",
            "blueprintIcon"
        );
        blueprintIcon.render = function (parentWindow)
        {
            var context = this.getContext();
            var blueprint = parentWindow.droneMenu.selectedBlueprint;
            var relativeCoords = this.getRelativeCoordinates(0, 0, parentWindow);
            drawImageFitInBox(context, blueprint.craftedItem.item.getIcon(), relativeCoords.x, relativeCoords.y, this.boundingBox.width, this.boundingBox.height);

            if(blueprint.category != 1 && blueprint.craftedItem.item.getQuantityOwned() > -1)
            {
                context.fillStyle = "#FFFFFF";
                var fontSize = Math.min(16, this.boundingBox.height * 0.037);
                context.font = fontSize + "px Verdana";
                context.textBaseline = "bottom";
                strokeTextShrinkToFit(
                    parentWindow.context,
                    blueprint.craftedItem.item.getCurrentLevel() + 1,
                    relativeCoords.x,
                    relativeCoords.y + iconSize,
                    this.boundingBox.height,
                    "right"
                );
                fillTextShrinkToFit(
                    parentWindow.context,
                    blueprint.craftedItem.item.getCurrentLevel() + 1,
                    relativeCoords.x,
                    relativeCoords.y + iconSize,
                    this.boundingBox.height,
                    "right"
                );
            }

        }.bind(blueprintIcon, this);
        this.droneMenu.bodyContainer.addHitbox(blueprintIcon);
        blueprintIcon.isVisible = () => this.droneMenu.selectedBlueprint != null;
        blueprintIcon.isEnabled = () => this.droneMenu.selectedBlueprint != null;
        this.droneMenu.bodyContainer.addHitbox(blueprintNameBox);
        blueprintNameBox.isVisible = () => this.droneMenu.selectedBlueprint != null;
        blueprintNameBox.isEnabled = () => this.droneMenu.selectedBlueprint != null;

        var droneDescriptionBox = this.droneMenu.bodyContainer.addHitbox(new Hitbox(
            {
                x: 0,
                y: blueprintNameBox.boundingBox.height * 1.25,
                width: this.droneMenu.bodyContainer.boundingBox.width,
                height: this.droneMenu.bodyContainer.boundingBox.height - blueprintNameBox.boundingBox.height * 1.25
            },
            {},
            ""
        ));
        droneDescriptionBox.render = function (root)
        {
            var coords = this.getRelativeCoordinates(0, 0, root);
            root.context.save();
            root.context.textBaseline = "top";
            root.context.font = "14px Verdana";
            fillTextWrap(
                root.context,
                root.selectedBlueprint.craftedItem.item.getDescription(),
                coords.x,
                coords.y,
                this.boundingBox.width
            )
            root.context.restore();
        }.bind(droneDescriptionBox, this);
        droneDescriptionBox.isVisible = () => this.droneMenu.selectedBlueprint != null;
        droneDescriptionBox.isEnabled = () => this.droneMenu.selectedBlueprint != null;

        var sendDroneButton = this.droneMenu.bodyContainer.addHitbox(new Button(
            upgradeb, _("Send Drone"), "24px Verdana", "#000000",
            {
                x: this.droneMenu.bodyContainer.boundingBox.width * 0.2,
                y: this.droneMenu.bodyContainer.boundingBox.height * 0.85,
                width: this.droneMenu.bodyContainer.boundingBox.width * 0.6,
                height: this.droneMenu.bodyContainer.boundingBox.height * 0.2,
            },
            {
                onmousedown: function ()
                {
                    if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    this.craftDrone(this.selectedBlueprint.craftedItem.item.id);
                    this.selectedPath = null;
                    this.caveNode = null;
                    this.droneMenu.hide();
                    if (this.isTutorialAtStep("sendDrone"))
                    {
                        dialogueManager.next("caveTutorial");
                    }
                }.bind(this)
            }
        ))
        sendDroneButton.isVisible = function (root)
        {
            if(root.droneMenu.selectedBlueprint != null)
            {
                this.image = root.caveSystem.canCraftDrone(root.droneMenu.selectedDrone) ? upgradeb : upgradebg_blank;
                return true;
            }
            return false;
        }.bind(sendDroneButton, this);
        sendDroneButton.isEnabled = () => this.droneMenu.selectedBlueprint != null && this.caveSystem.canCraftDrone(this.droneMenu.selectedDrone);
    
        var hintHighlight = sendDroneButton.addHitbox(new EasyHintHighlight(function(parentWindow) {
            return parentWindow.isTutorialAtStep("sendDrone");
        }.bind(sendDroneButton, this)))
        hintHighlight.root = this;
        hintHighlight.rootContext = this.context;
        hintHighlight.sizeReduction = hintHighlight.lineWidth;
        hintHighlight.highlightColor = "#FEFF37";
    }

    renderAnimatedDrone(context, drone, x, y, width, height)
    {
        context.save();
        // context.imageSmoothingEnabled = false;
        var droneAnimationFrames = 4;
        var droneWidth = drone.spritesheet.width / droneAnimationFrames;
        var frameIndex = numFramesRendered % droneAnimationFrames;
        if(!drone.isMovingForward)
        {
            // Flip the drawing
            // DP: Apparently this might cause performance issues. Might want a better way to do it
            context.scale(-1, 1);
            x = -(x + width);
        }
        if(drone.isTakingDamage && drone.flickerFrames.damage && frameIndex == drone.flickerFrames.acting.frameIndex)
        {
            context.drawImage(
                drone.flickerFrames.damage.image,
                x,
                y,
                width,
                height
            )
        }
        else if(drone.isHealing && drone.flickerFrames.healing && frameIndex == drone.flickerFrames.healing.frameIndex)
        {
            context.drawImage(
                drone.flickerFrames.healing.image,
                x,
                y,
                width,
                height
            )
        }
        else if(drone.isActing && drone.flickerFrames.acting && frameIndex == drone.flickerFrames.acting.frameIndex)
        {
            context.drawImage(
                drone.flickerFrames.acting.image,
                x,
                y,
                width,
                height
            )
        }
        else
        {
            context.drawImage(
                drone.spritesheet,
                droneWidth * (frameIndex),
                0,
                droneWidth,
                drone.spritesheet.height,
                x,
                y,
                width,
                height
            )
        }
        context.restore();
    }

    renderDroneList()
    {
        this.droneListScrollbox.clearCanvas();
        var context = this.droneListScrollbox.context;
        var lineHeightFraction = 0.2;
        context.save();
        // context.imageSmoothingEnabled = false;
        context.drawImage(this.backgroundImage, 0, 0, this.droneListScrollbox.canvas.width, this.bodyContainer.boundingBox.height * 0.5);
        var barHeight = this.droneListBar.boundingBox.height;
        var fuelBarWidth = this.droneListScrollbox.boundingBox.width * 0.2;
        var fuelBarHeight = barHeight * 0.85;
        var lineYCoordinate;

        context.fillStyle = "#FFFFFF";
        context.strokeStyle = "#000000";
        context.textBaseline = "bottom";
        context.lineWidth = 3;
        this.droneListScrollbox.contentHeight = Math.max(
            this.bodyContainer.boundingBox.height * 0.5,
            this.droneListBar.boundingBox.height * this.caveSystem.activeDrones.length
        );
        context.font = "20px Verdana";
        // var workloadText = _("Current Workload: {0}", GemForger.currentLoad() + "/" + GemForger.currentMaxLoad());
        // context.strokeText(workloadText, this.droneListScrollbox.contentWidth * .5 - context.measureText(workloadText).width / 2, this.droneListScrollbox.boundingBox.height * 0.05);
        // context.fillText(workloadText, this.droneListScrollbox.contentWidth * .5 - context.measureText(workloadText).width / 2, this.droneListScrollbox.boundingBox.height * 0.05);

        context.globalAlpha = 0.3;
        for(var i = 0; i < this.caveSystem.activeDrones.length; i++)
        {
            var drone = this.caveSystem.activeDrones[i];
            context.globalAlpha = 0.3;
            lineYCoordinate = ((barHeight * 1.02) * i);
            if(i % 2 == 0)
            {
                renderRoundedRectangle(context, 0, lineYCoordinate, this.droneListScrollbox.contentWidth, this.droneListBar.boundingBox.height, 0, "#AAAAAA", "#555555", 0);
            }
            context.globalAlpha = 1;
            this.renderAnimatedDrone(context, drone, barHeight * 0.1, lineYCoordinate + barHeight * 0.1, barHeight * 0.8, barHeight * 0.8);
            for(var j = 0; j < drone.rewardCapacity; ++j)
            {
                context.globalAlpha = 0.5;
                context.fillStyle = "#000000";
                context.fillRect(
                    this.droneListScrollbox.contentWidth - (0.652 * j + 1) * barHeight,
                    lineYCoordinate + barHeight / 2 - 0.325 * barHeight,
                    0.65 * barHeight,
                    0.65 * barHeight
                );
                context.globalAlpha = 1;
                if(j < drone.inventory.length)
                {
                    var droneReward = this.caveSystem.rewards[drone.inventory[j]];
                    drawImageFitInBox(
                        context,
                        droneReward.icon,
                        this.droneListScrollbox.contentWidth - (0.652 * j + 1) * barHeight + barHeight * 0.05,
                        lineYCoordinate + barHeight / 2 - 0.325 * barHeight,
                        barHeight * 0.5,
                        barHeight * 0.5
                    )
                }
                drawImageFitInBox(
                    context,
                    itemFrame,
                    this.droneListScrollbox.contentWidth - (0.652 * j + 1) * barHeight,
                    lineYCoordinate + barHeight / 2 - 0.325 * barHeight,
                    barHeight * 0.65,
                    barHeight * 0.65
                )
            }
            var healthBarWidth = this.droneListScrollbox.boundingBox.width * 0.2;
            var healthBarHeight = barHeight * 0.425;
            renderFancyProgressBar(
                context,
                "",
                drone.currentHealth / drone.totalHealth,
                1.25 * barHeight,
                lineYCoordinate + barHeight / 2 - healthBarHeight,
                healthBarWidth,
                healthBarHeight,
                "#c92828",
                "#000000",
                "#FFFFFF",
                timerFrame
            );
            renderFancyProgressBar(
                context,
                "",
                drone.currentFuel / drone.totalFuel,
                1.25 * barHeight,
                lineYCoordinate + barHeight / 2,
                healthBarWidth,
                healthBarHeight,
                "#5EB65D",
                "#000000",
                "#FFFFFF",
                timerFrame
            );
            var droneProgress;
            if(drone.waitAtNodeTime > 0)
            {
                if(drone.nodePath[drone.lastReachedNodeIndex].currentHealth &&
                    drone.nodePath[drone.lastReachedNodeIndex].currentHealth > 0)
                {
                    droneProgress = 1 - drone.nodePath[drone.lastReachedNodeIndex].currentHealth / drone.nodePath[drone.lastReachedNodeIndex].totalHealth;
                }
                else
                {
                    droneProgress = 1 - drone.waitAtNodeTime / drone.totalWaitTime;
                }
            }
            else
            {
                droneProgress = drone.progressToNextNode;
            }
            renderFancyProgressBar(
                context,
                drone.status,
                droneProgress,
                1.5 * barHeight + healthBarWidth,
                lineYCoordinate + barHeight / 2 - (healthBarHeight * 1.5) / 2,
                healthBarWidth * 1.5,
                healthBarHeight * 1.5,
                "#7F7F7F",
                "#000000",
                "#FFFFFF",
                timerFrame
            );
            var timeRemaining = drone.getEstimatedTimeRemaining();
        }
        context.globalAlpha = 1;

        context.restore();
        this.droneListScrollbox.renderChildren();
    }

    getRewardsListFromArray(rewardsArray, listSeparator, startWithSeparator = false)
    {
        var listString = "";
        if(startWithSeparator) listString += listSeparator;
        for(var i in rewardsArray)
        {
            listString += rewardsArray[i].getName();
            if(i < rewardsArray.length - 1)
            {
                listString += listSeparator;
            }
        }
        return listString;
    }

    getIngredientListWithDiscounts(ingredients)
    {
        var discountedIngredients = {};
        for(var i in ingredients)
        {
            discountedIngredients[i] = {
                item: ingredients[i].item,
                quantity: this.getDiscountedIngredientQuantity(ingredients[i])
            }
        }
        return discountedIngredients;
    }

    getDiscountedIngredientQuantity(ingredient)
    {
        var discount;
        switch(ingredient.item.getName())
        {
            case "Money":
                discount = STAT.blueprintPriceMultiplier();
                break;
            default:
                discount = 1;
        }
        return Math.ceil(ingredient.quantity * discount);
    }

    getCaveWorld()
    {
        if(this.caveSystem.kmDepth <= 1000) return EARTH_INDEX;
        else return MOON_INDEX;
    }

    setColorPalette()
    {
        var worldIndex = this.getCaveWorld();
        if(worldIndex == EARTH_INDEX)
        {
            this.colorPalette = {
                revealed: "#80513c",
                hidden: "#4a372f",
                tunnelEdge: "#663b36",
                questionMark: caveIconQuestionMark
            }
        }
        else if(worldIndex == MOON_INDEX)
        {
            this.colorPalette = {
                revealed: "#5ea0a8",
                hidden: "#3c6f75",
                tunnelEdge: "#4f777d",
                questionMark: caveIconQuestionMarkMoon
            }
        }
        else if(worldIndex == TITAN_INDEX)
        {
            this.colorPalette = {
                revealed: "#5ea0a8",
                hidden: "#3c6f75",
                tunnelEdge: "#4f777d",
                questionMark: caveIconQuestionMarkMoon
            }
        }
    }

    startCaveTutorial()
    {
        this.isTutorialActive = true;

        dialogueManager.initialize(
            "caveTutorial",
            {
                drone: {
                    name: _("Droney"),
                    spritesheet: new SpritesheetAnimation(
                        caveBuildingDrone,
                        2,
                        5
                    )
                }
            },
            [
                {
                    entryKey: "caveIntro1",
                    speaker: "drone",
                    text: _("Welcome to the caves! You can send drones into the cave to collect rewards like minerals, chests, and more!"),
                    clickToContinue: true
                },
                {
                    entryKey: "selectNode",
                    speaker: "drone",
                    text: _("Tap a cave chamber to get started!"),
                    clickToContinue: false
                },
                // DRONE MENU OPEN
                {
                    entryKey: "nodeInfoExplanation",
                    speaker: "drone",
                    text: _("This window shows what's in the cave chamber. If the chamber is revealed, it will display all of the chamber's treasures and obstacles."),
                    clickToContinue: false
                },
                {
                    entryKey: "dronesExplanation",
                    speaker: "drone",
                    text: _("These are your drones! They all do different things. Let's start with a basic drone!"),
                    clickToContinue: false
                },
                {
                    entryKey: "sendDrone",
                    speaker: "drone",
                    text: _("These are the drone stats! Tap the button to send the drone!"),
                    clickToContinue: false
                },
                // DRONE MENU CLOSE
                {
                    entryKey: "expandDroneList",
                    speaker: "drone",
                    text: _("There it goes! Tap the drone list to see your drone's status!"),
                    clickToContinue: false,
                },
                {
                    entryKey: "droneStatusExplanation",
                    speaker: "drone",
                    text: _("Here you can see your drone's health, fuel, progress, and inventory."),
                    clickToContinue: true,
                },
                {
                    entryKey: "fuelExplanation",
                    speaker: "drone",
                    text: _("This is your total fuel for this cave. Each drone will use some of this fuel when it is sent out."),
                    clickToContinue: true,
                },
                {
                    entryKey: "timeExplanation",
                    speaker: "drone",
                    text: _("This is the time you have left to explore the cave. Once the cave collapses, everything in it is gone!"),
                    clickToContinue: true,
                },
                {
                    entryKey: "droneReturn",
                    speaker: "drone",
                    text: _("When a drone returns, it gives back its remaining fuel and drops off its treasure! You can collect the treasure in the cave building at 45km!"),
                    clickToContinue: true
                },
                {
                    entryKey: "end",
                    speaker: "drone",
                    text: _("Be sure to experiment to learn how to use each drone. You can upgrade your drone stats in the cave building at 45km. Happy mining!"),
                    clickToContinue: true,
                    onEnd: function()
                    {
                        this.isTutorialActive = false;
                        hasSeenCaveTutorial = true;
                    }.bind(this)
                }
            ]
        );
        dialogueManager.setOnEndFunction(function()
        {
            this.isTutorialActive = false;
            hasSeenCaveTutorial = true;
        }.bind(this));
        dialogueManager.show();
    }

    isTutorialAtStep(entryKey)
    {
        return this.isTutorialActive && dialogueManager.compareEntryKey(entryKey);
    }
}