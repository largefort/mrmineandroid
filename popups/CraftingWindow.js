class CraftingWindow extends BottomTabbedPopup
{
    layerName = "crafting"; // Used as key in activeLayers
    domElementId = "CRAFTINGD"; // ID of dom element that gets shown or hidden
    context = CRAFTING;         // Canvas rendering context for popup

    blueprintPane;
    blueprintPaneDefaultWidth;
    blueprintListHitboxes;

    craftingPane;
    isCraftingPaneInitialized = false;
    selectedBlueprint;
    discountedIngredients;

    constructor(boundingBox, worldIndex = 0)
    {
        super(boundingBox);
        if(!boundingBox)
        {
            this.setBoundingBox();
        }

        // this.context.imageSmoothingEnabled = false;
        this.initializeTabs([_("Craft"), _("Structures")]);
        this.initializeTabNotifications([[notificationManager.NOTIFICATION_IDS.canCraftDrill],[notificationManager.NOTIFICATION_IDS.canCraftStructure]])
        this.blueprintPaneDefaultWidth = this.bodyContainer.boundingBox.width * 0.4;
        this.blueprintPane = new DraggableScrollbox(
            this.bodyContainer.boundingBox.width - 15,
            this.bodyContainer.boundingBox.height,
            this.context,
            this.bodyContainer.boundingBox.x,
            this.bodyContainer.boundingBox.y,
            this.bodyContainer.boundingBox.width,
            this.bodyContainer.boundingBox.height,
            15
        );
        // this.blueprintPane.context.imageSmoothingEnabled = false;
        this.addHitbox(this.blueprintPane);
        this.craftingPane = new Hitbox(
            {
                x: 0,
                y: 0,
                width: this.bodyContainer.boundingBox.width,
                height: this.bodyContainer.boundingBox.height
            },
            {},
            "",
            "craftingPane"
        )
        this.craftingPane.render = function ()
        {
            var context = this.parent.parent.context;
            var coords = this.getRelativeCoordinates(0, 0, this.parent.parent);
            context.save();
            context.fillStyle = "#444444";
            context.fillRect(coords.x, coords.y, 3, this.boundingBox.height);
            this.renderChildren();
        }
        this.craftingPane.allowBubbling = true;
        this.craftingPane.isVisible = () => this.selectedBlueprint != null;
        this.craftingPane.isEnabled = () => this.selectedBlueprint != null;
        this.blueprintPane.isVisible = () => this.selectedBlueprint == null;
        this.blueprintPane.isEnabled = () => this.selectedBlueprint == null;
        this.bodyContainer.addHitbox(this.craftingPane);
        this.initializeBlueprintList();
        this.initializeCraftingPane();
        this.initializeEquipList();
        if (this.currentTabIndex == 0)
        {
            notificationManager.markAsSeen(notificationManager.NOTIFICATION_IDS.canCraftDrill);
        }
    }

    render()
    {
        if(this.currentTabIndex <= 1)
        {
            var menuPadding = 2;
            this.context.save();
            this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
            if(isKnownBlueprintsDirty)
            {
                this.initializeBlueprintList();
                isKnownBlueprintsDirty = false;
            }
            if(this.blueprintListHitboxes.length > 0)
            {
                // Update bounding boxes to account for menu expansion
                for(var i = 1; i < this.blueprintListHitboxes.length; ++i)
                {
                    this.blueprintListHitboxes[i].canCraftBlueprintInSubcategory = false;
                    if(this.blueprintListHitboxes[i].boundingBox.y != this.blueprintListHitboxes[i - 1].boundingBox.y + this.blueprintListHitboxes[i - 1].boundingBox.height + menuPadding)
                    {
                        this.blueprintListHitboxes[i].boundingBox.y = this.blueprintListHitboxes[i - 1].boundingBox.y + this.blueprintListHitboxes[i - 1].boundingBox.height + menuPadding;
                    }
                }
                var bottomOfLastMenu = this.blueprintListHitboxes[i - 1].boundingBox.y + this.blueprintListHitboxes[i - 1].boundingBox.height + menuPadding;
                if(bottomOfLastMenu != this.blueprintPane.contentHeight)
                {
                    this.blueprintPane.contentHeight = bottomOfLastMenu;
                    this.blueprintPane.initializeScrollbar();
                    this.blueprintPane.render();
                    this.blueprintPane.scrollTo(this.blueprintPane.currentScrollY);
                }
            }
            this.context.restore();
            super.render();
            this.blueprintPane.renderChildren();
        }

        if(this.currentTabIndex == 0 && this.selectedBlueprint && this.selectedBlueprint.shopSubcategory == "Golem")
        {
            showGolemDialogue();
        }
        else if(this.currentTabIndex == 0 && this.selectedBlueprint && this.selectedBlueprint.shopSubcategory == "Broken Robot")
        {
            showGidgetDialogue();
        }
        else
        {
            showMechanicDialogue();
        }
    }

    close()
    {
        activeLayers.MainUILayer.removeDialogueAttachment();
        animate();

        return super.close();
    }

    onTabChange()
    {
        this.selectedBlueprint = null;
        this.blueprintListHitboxes = [];
        if (this.currentTabIndex == 0)
        {
            notificationManager.markAsSeen(notificationManager.NOTIFICATION_IDS.canCraftDrill);
        }
        else if (this.currentTabIndex == 1)
        {
            notificationManager.markAsSeen(notificationManager.NOTIFICATION_IDS.canCraftStructure);
        }
        this.blueprintPane.scrollTo(0);
        this.initializeBlueprintList();
        this.initializeCraftingPane();
        this.blueprintPane.contentHeight = 1;
        this.blueprintPane.clearCanvas();
        this.blueprintPane.initializeScrollbar();
        this.tutorialFlicker();
    }

    initializeBlueprintList(openSubcategoryMenus = [])
    {
        var parentHitbox = this.blueprintPane;
        var craftCategory;
        parentHitbox.clearHitboxes();
        for(var i in this.blueprintListHitboxes)
        {
            if(!this.blueprintListHitboxes[i].isCollapsed)
            {
                openSubcategoryMenus.push(i);
            }
        }
        // parentHitbox.context.clearRect(0, 0, parentHitbox.contentWidth, parentHitbox.contentHeight);
        this.blueprintListHitboxes = [];
        var cumulativeHeight = 0;
        var blueprintList;
        if(this.currentTabIndex == 0)
        {
            craftCategory = 1;
            blueprintList = getKnownBlueprints();
            var blueprintsInCategory = filterBlueprintsByCategoryAndLevel(blueprintList, craftCategory);
            blueprintsInCategory = sortBlueprintsByShopSubcategory(blueprintsInCategory);
        }
        else if(this.currentTabIndex == 1)
        {
            craftCategory = 3;
            blueprintList = getKnownBlueprints();
            var blueprintsInCategory = filterBlueprintsByCategory(blueprintList, craftCategory);
            //blueprintsInCategory = filterBlueprints(blueprintsInCategory, function (blueprint) {return !blueprint.craftedItem.item.isAtMaxLevel();});
            blueprintsInCategory = sortBlueprintsBySubcategory(blueprintsInCategory);
        }
        for(var subcategory in blueprintsInCategory)
        {
            //targetCanvasContext, x, y, width, collapsedHeight, expandedHeight, titleText, fontSize, fontColor
            var newMenu = new CollapsibleMenu(
                parentHitbox.context,
                0,
                cumulativeHeight,
                parentHitbox.boundingBox.width - parentHitbox.scrollbarWidth,
                parentHitbox.boundingBox.height / 5,
                0,
                subcategory,
                "18px KanitM",
                "#FFFFFF"
            );
            // newMenu.context.imageSmoothingEnabled = false;
            this.generateSubcategoryMenuContents(blueprintsInCategory[subcategory], newMenu);
            this.blueprintListHitboxes.push(newMenu);
            parentHitbox.addHitbox(newMenu);
            cumulativeHeight += newMenu.boundingBox.height;
        }
        if(openSubcategoryMenus.length > 0)
        {
            for(var i in openSubcategoryMenus)
            {
                if(this.blueprintListHitboxes[openSubcategoryMenus[i]])
                {
                    this.blueprintListHitboxes[openSubcategoryMenus[i]].expand();
                }
            }
        }
        else if(this.blueprintListHitboxes.length == 1)
        {
            this.blueprintListHitboxes[0].expand();
        }
        parentHitbox.isDirty = true;
        // parentHitbox.render();
        // this.render();
    }

    generateSubcategoryMenuContents(blueprintsInSubcategory, menuHitbox)
    {
        var slotSize = Math.min(85, Math.floor(this.boundingBox.height * 0.16));
        var padding = 3;
        var slotsPerRow = Math.floor((menuHitbox.boundingBox.width - padding * 2) / slotSize);
        var totalRows = Math.ceil(blueprintsInSubcategory.length / slotsPerRow);
        var slotSpacing = ((menuHitbox.boundingBox.width - padding * 2) - (slotSize * slotsPerRow)) / (slotsPerRow - 1);
        menuHitbox.setCanvasHeight(totalRows * (slotSize + slotSpacing) + 2 * padding);
        menuHitbox.expandedHeight = menuHitbox.canvas.height + menuHitbox.collapsedHeight;
        menuHitbox.context.save();
        menuHitbox.showNotificationIcon = false;
        for(var i = 0; i < blueprintsInSubcategory.length; ++i)
        {
            var blueprint = blueprintsInSubcategory[i];
            if(!blueprint) continue;
            var indexInRow = i % slotsPerRow;
            var slotX = padding + indexInRow * (slotSize + slotSpacing);
            var slotY = padding + Math.floor(i / slotsPerRow) * (slotSize + slotSpacing);
            drawImageFitInBox(
                menuHitbox.context,
                blueprint.craftedItem.item.getIcon(),
                slotX,
                slotY,
                slotSize,
                slotSize
            );
            if(blueprint.category == 3 && blueprint.craftedItem.item.getQuantityOwned() > -1)
            {
                menuHitbox.context.fillStyle = "#FFFFFF";
                menuHitbox.context.strokeStyle = "#000000";
                var fontSize = Math.min(16, this.boundingBox.height * 0.07);
                menuHitbox.context.font = fontSize + "px KanitM";
                menuHitbox.context.textBaseline = "bottom";
                menuHitbox.context.lineWidth = 5;
                if(!blueprint.craftedItem.item.isAtMaxLevel())
                {
                    strokeTextShrinkToFit(
                        menuHitbox.context,
                        blueprint.craftedItem.item.getCurrentLevel() + 1,
                        slotX,
                        slotY + slotSize,
                        slotSize,
                        "right"
                    );
                    fillTextShrinkToFit(
                        menuHitbox.context,
                        blueprint.craftedItem.item.getCurrentLevel() + 1,
                        slotX,
                        slotY + slotSize,
                        slotSize,
                        "right"
                    );
                }
                else
                {
                    strokeTextShrinkToFit(
                        menuHitbox.context,
                        _("max"),
                        slotX,
                        slotY + slotSize,
                        slotSize,
                        "right"
                    );
                    fillTextShrinkToFit(
                        menuHitbox.context,
                        _("max"),
                        slotX,
                        slotY + slotSize,
                        slotSize,
                        "right"
                    );
                }
            }
            var itemHitbox = new Hitbox(
                {
                    x: slotX,
                    y: slotY + menuHitbox.collapsedHeight,
                    width: slotSize,
                    height: slotSize
                },
                {
                    onmousedown: function (blueprint)
                    {
                        hideTooltip();
                        this.selectedBlueprint = blueprint;
                        if(blueprint.hasOwnProperty("levels"))
                        {
                            var currentLevel = blueprint.craftedItem.item.getCurrentLevel();
                            if(!blueprint.craftedItem.item.isAtMaxLevel())
                            {
                                this.discountedIngredients = getIngredientListWithDiscounts(blueprint.levels[currentLevel].ingredients);
                            }
                            else
                            {
                                this.discountedIngredients = null;
                            }
                        }
                        else
                        {
                            this.discountedIngredients = getIngredientListWithDiscounts(blueprint.ingredients);
                        }
                        this.initializeCraftingPane();
                    }.bind(this, blueprint),
                    onmouseenter: function (blueprint, x, y)
                    {
                        var coords = this.getGlobalCoordinates(x, y);
                        showTooltip(
                            _(blueprint.craftedItem.item.getName()),
                            _(blueprint.craftedItem.item.getDescription()),
                            coords.x * uiScaleX,
                            coords.y * uiScaleY
                        );
                    }.bind(menuHitbox, blueprint, slotX, slotY + slotSize + menuHitbox.collapsedHeight),
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                "pointer"
            );
            menuHitbox.addHitbox(itemHitbox, true);
            var highlight = new EasyHintHighlight(function(menuHitbox, blueprint)
            {
                var canCraft = canCraftBlueprint(blueprint.category, blueprint.id, -1);
                if (canCraft)
                {
                    menuHitbox.canCraftBlueprintInSubcategory = canCraft;
                }
                return !menuHitbox.isCollapsed && canCraft;
            }.bind(this, menuHitbox, blueprint));
            highlight.root = this.blueprintPane;
            highlight.rootContext = this.blueprintPane.context;
            highlight.fillRelativeAlpha = 0.3;
            highlight.highlightColor = "#71f06e";
            itemHitbox.addHitbox(highlight);
        }
        var highlight = new EasyHintHighlight(function(menuHitbox)
        {
            return menuHitbox.isCollapsed && menuHitbox.canCraftBlueprintInSubcategory;
        }.bind(this, menuHitbox, blueprint));
        highlight.root = this.blueprintPane;
        highlight.rootContext = this.blueprintPane.context;
        highlight.fillRelativeAlpha = 0.3;
        highlight.highlightColor = "#71f06e";
        menuHitbox.addHitbox(highlight);
        menuHitbox.context.restore();
    }

    initializeCraftingPane()
    {
        if(this.selectedBlueprint)
        {
            if(this.currentTabIndex == 1)
            {
                if(this.selectedBlueprint.hasOwnProperty("levels"))
                {
                    var currentLevel = this.selectedBlueprint.craftedItem.item.getCurrentLevel();
                    if(!this.selectedBlueprint.craftedItem.item.isAtMaxLevel())
                    {
                        this.discountedIngredients = getIngredientListWithDiscounts(this.selectedBlueprint.levels[currentLevel].ingredients);
                    }
                    else
                    {
                        this.discountedIngredients = null;
                    }
                }
            }

            if(isBlueprintUnseen(this.selectedBlueprint.category, this.selectedBlueprint.id))
            {
                flagBlueprintAsSeen(this.selectedBlueprint.category, this.selectedBlueprint.id);
            }
            this.initializeBlueprintList();
            this.craftingPane.clearHitboxes();
            var isSelectedBlueprintKnown = isBlueprintKnown(
                this.selectedBlueprint.category,
                this.selectedBlueprint.id
            );
            var isSelectedBlueprintAvailable = isBlueprintAvailable(
                this.selectedBlueprint.category,
                this.selectedBlueprint.id
            );
            var xPadding = 20;
            var yPadding = this.boundingBox.height * 0.07;
            var iconSize = Math.min(85, Math.ceil(this.boundingBox.height * 0.16));
            var titleBoxPadding = iconSize / 10;
            var blueprintNameBox = new Hitbox(
                {
                    x: 0,
                    y: 0,
                    width: this.craftingPane.boundingBox.width,
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
                var fontSize = iconSize;
                context.font = fontSize + "px KanitM";
                context.fillStyle = "#FFFFFF";
                context.textBaseline = "top";
                fillTextWrapWithHeightLimit(
                    context,
                    parentWindow.selectedBlueprint.craftedItem.item.getName(),
                    relativeCoords.x + 2 * iconSize + titleBoxPadding * 5,
                    relativeCoords.y + titleBoxPadding,
                    this.boundingBox.width - 2 * iconSize - titleBoxPadding * 6,
                    this.boundingBox.height - 2 * titleBoxPadding,
                    "left",
                    0.25,
                    "center"
                );
                context.restore();
                this.renderChildren();
            }.bind(blueprintNameBox, this);
            blueprintNameBox.allowBubbling = true;

            var backButton = new Button(
                backButtonIcon, "", "", "",
                {
                    x: titleBoxPadding,
                    y: titleBoxPadding,
                    width: iconSize,
                    height: iconSize
                },
                {
                    onmousedown: function ()
                    {
                        this.selectedBlueprint = null;
                    }.bind(this)
                },
                'pointer',
                "closeButton"
            )
            backButton.isVisible = () => this.selectedBlueprint != null;
            backButton.isEnabled = () => this.selectedBlueprint != null;
            blueprintNameBox.addHitbox(backButton);

            var blueprintIcon = new Hitbox(
                {
                    x: iconSize + 2 * titleBoxPadding,
                    y: titleBoxPadding,
                    width: iconSize,
                    height: iconSize
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
                        showTooltip(
                            _(blueprint.craftedItem.item.getName()),
                            blueprint.craftedItem.item.getDescription(),
                            coords.x * uiScaleX,
                            coords.y * uiScaleY
                        );
                    }.bind(blueprintNameBox, this.selectedBlueprint, titleBoxPadding, titleBoxPadding + iconSize),
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
                var blueprint = parentWindow.selectedBlueprint;
                var relativeCoords = this.getRelativeCoordinates(0, 0, parentWindow);
                drawImageFitInBox(context, blueprint.craftedItem.item.getIcon(), relativeCoords.x, relativeCoords.y, iconSize, iconSize);
                context.drawImage(itemFrame, relativeCoords.x, relativeCoords.y, iconSize, iconSize);
                if(blueprint.category != 1 && blueprint.craftedItem.item.getQuantityOwned() > -1)
                {
                    context.fillStyle = "#FFFFFF";
                    var fontSize = Math.min(16, this.boundingBox.height * 0.07);
                    context.font = fontSize + "px KanitM";
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

            var ingredientsFontSize = Math.min(26, this.boundingBox.height * 0.07);
            var blueprintIngredientsBox = new Hitbox(
                {
                    x: xPadding,
                    y: blueprintNameBox.boundingBox.y + blueprintNameBox.boundingBox.height + titleBoxPadding,
                    width: this.boundingBox.width - 2 * xPadding,
                    height: titleBoxPadding * 4 + iconSize * 2 + ingredientsFontSize * 2
                },
                {}, "", "ingredients"
            );
            blueprintIngredientsBox.render = function (parentWindow)
            {
                var context = this.getContext();
                var relativeCoords = this.getRelativeCoordinates(0, 0, parentWindow);
                context.save();
                context.textBaseline = "top";
                if(parentWindow.currentTabIndex == 0)
                {
                    context.fillStyle = "#FFFFFF";
                    context.font = ingredientsFontSize + "px KanitB";
                    fillTextWrap(context, _("Blueprint"), relativeCoords.x, relativeCoords.y, parentWindow.boundingBox.width);
                    context.font = ingredientsFontSize + "px KanitM";

                    fillTextWrapWithHeightLimit(
                        context,
                        parentWindow.selectedBlueprint.craftedItem.item.getDescription(),
                        relativeCoords.x - titleBoxPadding / 2,
                        relativeCoords.y + ingredientsFontSize,
                        parentWindow.boundingBox.width / 2,
                        parentWindow.boundingBox.height * 0.4,
                        "left",
                        0.25
                    );
                }
                else if(parentWindow.currentTabIndex == 1)
                {
                    context.fillStyle = "#FFFFFF";
                    context.font = ingredientsFontSize + "px KanitB";
                    fillTextWrap(context, _("Blueprint"), relativeCoords.x, relativeCoords.y, parentWindow.boundingBox.width);
                    context.font = ingredientsFontSize + "px KanitM";

                    fillTextWrapWithHeightLimit(
                        context,
                        parentWindow.selectedBlueprint.craftedItem.item.getDescription(),
                        relativeCoords.x,
                        relativeCoords.y + ingredientsFontSize,
                        parentWindow.boundingBox.width / 2,
                        parentWindow.boundingBox.height * 0.4,
                        "left",
                        0.25
                    );
                }
                else
                {
                    // context.fillRect(relativeCoords.x, relativeCoords.y + ingredientsFontSize, this.boundingBox.width, this.boundingBox.height - ingredientsFontSize);
                    context.globalAlpha = 1;
                    context.fillStyle = "#FFFFFF";
                    context.font = ingredientsFontSize + "px KanitM";
                    // context.textBaseline = "top";
                    // context.fillText(_("Ingredients"), relativeCoords.x, relativeCoords.y)    
                    fillTextWrapWithHeightLimit(
                        context,
                        parentWindow.selectedBlueprint.craftedItem.item.getDescription(),
                        relativeCoords.x,
                        relativeCoords.y + ingredientsFontSize,
                        parentWindow.boundingBox.width / 2,
                        parentWindow.boundingBox.height * 0.4,
                        "left",
                        0.25
                    );
                }
                context.globalAlpha = 0.6;
                context.fillStyle = "#111111";
                context.fillRect(
                    relativeCoords.x + blueprintIngredientsBox.boundingBox.width * 0.55,
                    relativeCoords.y,
                    blueprintIngredientsBox.boundingBox.width * 0.5,
                    this.boundingBox.height * 0.8
                );
                context.restore();
                this.renderChildren();
            }.bind(blueprintIngredientsBox, this);
            var boxArea = (blueprintIngredientsBox.boundingBox.height * 0.8 - 10 * titleBoxPadding) * (blueprintIngredientsBox.boundingBox.width * 0.5 - 12 * titleBoxPadding);
            var ingredientIconSize = iconSize * 0.75;
            var slotsPerRow = Math.max(
                1,
                Math.floor((blueprintIngredientsBox.boundingBox.width * 0.5 - titleBoxPadding * 2) / ingredientIconSize)
            );
            var slotSpacing;
            if(slotsPerRow == 1)
            {
                slotSpacing = 0;
            }
            else
            {
                slotSpacing = titleBoxPadding;
            }
            if(isSelectedBlueprintKnown || isSelectedBlueprintAvailable)
            {
                var yOffset = 0;
                for(var i in this.discountedIngredients)
                {
                    var indexInRow = i % slotsPerRow;
                    var slotX = blueprintIngredientsBox.boundingBox.width * 0.55 + titleBoxPadding + indexInRow * (ingredientIconSize + slotSpacing);
                    var slotY = titleBoxPadding + Math.floor(i / slotsPerRow) * (ingredientIconSize + slotSpacing);
                    var ingredientIcon = new Hitbox(
                        {
                            x: slotX,
                            y: slotY + yOffset,
                            width: ingredientIconSize,
                            height: ingredientIconSize
                        },
                        {
                            onmousedown: function (blueprint)
                            {
                                if(blueprint)
                                {
                                    if(blueprint.category != this.currentTabIndex)
                                    {
                                        this.blueprintPane.scrollTo(0);
                                        this.currentTabIndex = blueprint.category + 1;
                                        this.initializeBlueprintList();
                                    }
                                    this.selectedBlueprint = blueprint;
                                    this.discountedIngredients = getIngredientListWithDiscounts(blueprint.ingredients);
                                    this.initializeCraftingPane();
                                }
                            }.bind(this, getBlueprintForCraftingItem(this.discountedIngredients[i].item, true)),
                            onmouseenter: function (ingredient, x, y)
                            {
                                var coords = this.getGlobalCoordinates(x, y);
                                showTooltip(
                                    _(ingredient.item.getName()),
                                    _("Owned: {0}<br>Required: {1}", beautifynum(ingredient.item.getQuantityOwned()), beautifynum(ingredient.quantity)),
                                    coords.x * uiScaleX,
                                    coords.y * uiScaleY
                                );
                            }.bind(blueprintIngredientsBox, this.discountedIngredients[i], slotX, slotY + ingredientIconSize + ingredientsFontSize),
                            onmousedown: function (ingredient)
                            {

                                var itemID = ingredient.item.id;
                                var isMineral = mineralIds.includes(itemID);
                                var isIsotope = isotopeIds.includes(itemID);
                                if(isIsotope && getDepthMineralIsFoundAt(itemID) == 99999 && itemID > highestIsotopeUnlocked)
                                {
                                    var bombardment = getBombardmentForIsotope(ingredient.item.id);
                                    if(depth >= 1134 && bombardment)
                                    {
                                        openUi(ReactorWindow, null, 1);
                                        activeLayers.Reactor.selectedBlueprint = getBlueprintById(6, bombardment.index - 1);
                                        activeLayers.Reactor.blueprintListHitboxes[5].toggle();
                                        activeLayers.Reactor.initializeCraftingPane();
                                    }
                                }
                                else if(managerStructure.level > 0 && (isMineral || isIsotope))
                                {
                                    var confirmationMessage = "";

                                    if(lockedMineralAmtsToSave[ingredient.item.id] > 0)
                                    {
                                        confirmationMessage += _("\n You're currently preventing {0} {1} from being sold. ", beautifynum(lockedMineralAmtsToSave[ingredient.item.id]), ingredient.item.getName());
                                    }

                                    confirmationMessage += _("Are you sure you want to prevent {0} {1} from being sold?", beautifynum(ingredient.quantity), ingredient.item.getName());

                                    showConfirmationPrompt(
                                        confirmationMessage,
                                        _("Yes"),
                                        function ()
                                        {
                                            lockedMineralAmtsToSave[ingredient.item.id] = ingredient.quantity;
                                            hideSimpleInput();
                                        },
                                        _("Cancel")
                                    )
                                }
                            }.bind(blueprintIngredientsBox, this.discountedIngredients[i]),
                            onmouseexit: function ()
                            {
                                hideTooltip();
                            }
                        },
                        "pointer"
                    )
                    ingredientIcon.render = function (parentWindow, ingredient)
                    {
                        var context = this.getContext();
                        var relativeCoords = this.getRelativeCoordinates(0, 0, parentWindow);
                        drawImageFitInBox(context, ingredient.item.getIcon(), relativeCoords.x, relativeCoords.y, ingredientIconSize, ingredientIconSize);
                        context.fillStyle = "#FFFFFF";
                        var fontSize = Math.min(16, parentWindow.boundingBox.height * 0.07);
                        context.font = fontSize + "px KanitM";
                        context.textBaseline = "bottom";
                        context.lineWidth = 3;
                        context.strokeStyle = "#000000";
                        strokeTextShrinkToFit(
                            context,
                            ingredient.item.getFormattedQuantity(ingredient.quantity),
                            relativeCoords.x,
                            relativeCoords.y + ingredientIconSize,
                            ingredientIconSize * 0.95,
                            "right"
                        );
                        fillTextShrinkToFit(
                            context,
                            ingredient.item.getFormattedQuantity(ingredient.quantity),
                            relativeCoords.x,
                            relativeCoords.y + ingredientIconSize,
                            ingredientIconSize * 0.95,
                            "right"
                        );
                        if(ingredient.item.hasQuantity(ingredient.quantity))
                        {
                            // drawImageFitInBox(context, checkmark, relativeCoords.x, relativeCoords.y, iconSize / 5, iconSize / 5);
                            renderCheckmark(context, relativeCoords.x, relativeCoords.y, ingredientIconSize / 5, ingredientIconSize / 5);
                        }
                        else
                        {
                            // drawImageFitInBox(context, xmark, relativeCoords.x, relativeCoords.y, iconSize / 5, iconSize / 5);
                            renderXMark(context, relativeCoords.x, relativeCoords.y, ingredientIconSize / 5, ingredientIconSize / 5);
                        }
                    }.bind(ingredientIcon, this, this.discountedIngredients[i]);
                    blueprintIngredientsBox.addHitbox(ingredientIcon);
                }
            }
            var craftButton = new Hitbox(
                {
                    x: blueprintNameBox.boundingBox.x + blueprintNameBox.boundingBox.width * 0.05,
                    y: (this.craftingPane.boundingBox.height * .9) - yPadding,
                    width: blueprintNameBox.boundingBox.width * 0.9,
                    height: this.craftingPane.boundingBox.height * 0.15
                },
                {
                    onmousedown: function ()
                    {
                        if(isSelectedBlueprintKnown && this.currentTabIndex == 0)
                        {
                            if(craftBlueprint(this.selectedBlueprint.category, this.selectedBlueprint.id, 0, this.discountedIngredients))
                            {
                                newNews(_("You crafted {0}", this.selectedBlueprint.craftedItem.item.getName()), true);
                                if(!mutebuttons) craftDrillAudio.play();
                            }
                        }
                        else if(isSelectedBlueprintKnown && this.currentTabIndex == 1)
                        {
                            var level = this.selectedBlueprint.craftedItem.item.getCurrentLevel();
                            if(craftBlueprint(this.selectedBlueprint.category, this.selectedBlueprint.id, level + 1, this.discountedIngredients))
                            {
                                newNews(_("You crafted {0}", this.selectedBlueprint.craftedItem.item.getName()), true);
                                if(!mutebuttons) craftStructureAudio.play();
                            }
                        }
                        this.initializeCraftingPane();
                    }.bind(this),
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                "pointer",
                "craftButton"
            )
            craftButton.onmouseenter = function (parentWindow)
            {
                if(parentWindow.currentTabIndex == 0 && !canCraftBlueprint(parentWindow.selectedBlueprint.category, parentWindow.selectedBlueprint.id, 0, parentWindow.discountedIngredients))
                {
                    var coords = this.getGlobalCoordinates(0, this.boundingBox.height);
                    showTooltip(getBlueprintNotCraftableReason(parentWindow.selectedBlueprint.category, parentWindow.selectedBlueprint.id), "", coords.x, coords.y);
                }
            }.bind(craftButton, this);
            craftButton.render = function (parentWindow)
            {
                var context = parentWindow.context;
                context.save();
                var relativeCoords = this.getRelativeCoordinates(0, 0, parentWindow);
                if(parentWindow.currentTabIndex == 0)
                {
                    if((isSelectedBlueprintKnown && canCraftBlueprint(parentWindow.selectedBlueprint.category, parentWindow.selectedBlueprint.id, 0, parentWindow.discountedIngredients)))
                    {
                        context.drawImage(upgradeb, relativeCoords.x, relativeCoords.y, this.boundingBox.width, this.boundingBox.height);
                        context.fillStyle = "#000000";
                    }
                    else
                    {
                        context.drawImage(upgradebg_blank, relativeCoords.x, relativeCoords.y, this.boundingBox.width, this.boundingBox.height);
                        context.fillStyle = "#444444";
                    }
                }
                else if(parentWindow.currentTabIndex == 1)
                {
                    var nextLevel = parentWindow.selectedBlueprint.craftedItem.item.getCurrentLevel() + 1;
                    if((isSelectedBlueprintKnown && canCraftBlueprint(parentWindow.selectedBlueprint.category, parentWindow.selectedBlueprint.id, nextLevel, parentWindow.discountedIngredients)))
                    {
                        context.drawImage(upgradeb, relativeCoords.x, relativeCoords.y, this.boundingBox.width, this.boundingBox.height);
                        context.fillStyle = "#000000";
                    }
                    else
                    {
                        context.drawImage(upgradebg_blank, relativeCoords.x, relativeCoords.y, this.boundingBox.width, this.boundingBox.height);
                        context.fillStyle = "#444444";
                    }
                }
                context.textBaseline = "middle";
                var buttonText;
                if(parentWindow.currentTabIndex == 0)
                {
                    if(drillState.equippedDrillEquips.indexOf(getDrillEquipByBlueprintId(parentWindow.selectedBlueprint.id).id) > -1)
                    {
                        buttonText = _("Equipped");
                        var fontSize = Math.min(26, parentWindow.boundingBox.height * 0.065);
                        context.font = fontSize + "px KanitB";
                    }
                    else
                    {
                        buttonText = _("Craft");
                        var fontSize = Math.min(32, parentWindow.boundingBox.height * 0.080);
                        context.font = fontSize + "px KanitB";
                    }
                }
                else if(parentWindow.currentTabIndex == 1)
                {
                    buttonText = _("Craft");
                    var fontSize = Math.min(32, parentWindow.boundingBox.height * 0.080);
                    context.font = fontSize + "px KanitB";
                }
                fillTextShrinkToFit(context, buttonText, relativeCoords.x + 10, relativeCoords.y + this.boundingBox.height / 2 + 2, this.boundingBox.width - 20, "center");
                context.restore();
            }.bind(craftButton, this)
            this.craftingPane.addHitbox(blueprintNameBox);
            blueprintNameBox.addHitbox(blueprintIcon);
            this.craftingPane.addHitbox(blueprintIngredientsBox);
            this.craftingPane.addHitbox(craftButton);
            this.isCraftingPaneInitialized = true;
        }
        else
        {
            var instructionsText;
            if(this.currentTabIndex == 0 || this.currentTabIndex == 1)
            {
                if(knownBlueprints.length == 0 || knownBlueprints.length == 1 && knownBlueprints[0] == "")
                {
                    instructionsText = _("You don't own any blueprints. Find more in the mines.");
                }
                else if(isMobile())
                {
                    instructionsText = _("Tap on a blueprint on the left to craft it");
                }
                else
                {
                    instructionsText = _("Click on a blueprint on the left to craft it");
                }
            }
            this.craftingPane.clearHitboxes();
            var instructionsHitbox = new Hitbox(
                {
                    x: 20,
                    y: 20,
                    width: this.craftingPane.boundingBox.width - 40,
                    height: this.craftingPane.boundingBox.height - 40,
                },
                {},
                "",
                "instructionsHitbox"
            );
            instructionsHitbox.render = function (parentWindow)
            {
                var coords = this.getRelativeCoordinates(0, 0, parentWindow);
                var context = parentWindow.context;
                context.font = "18px KanitM";
                context.fillStyle = "#FFFFFF";
                context.textBaseline = "middle";
                fillTextWrap(
                    context,
                    instructionsText,
                    coords.x,
                    coords.y + this.boundingBox.height / 2 - 30,
                    this.boundingBox.width
                );
            }.bind(instructionsHitbox, this);
            this.craftingPane.addHitbox(instructionsHitbox);
        }
    }

    initializeEquipList()
    {
        var iconSize = Math.min(85, Math.ceil(this.boundingBox.height * 0.16));
        var padding = 10;
        var equipList = new Hitbox(
            {
                x: 30,
                y: this.bodyContainer.boundingBox.height / 2 - iconSize / 2,
                width: this.bodyContainer.boundingBox.width,
                height: iconSize
            },
            {}, "", "equipList"
        );
        for(var i = 0; i < 4; ++i)
        {
            var equipHitbox = new Hitbox(
                {
                    x: i * (iconSize + padding),
                    y: 0,
                    width: iconSize,
                    height: iconSize
                },
                {
                    onmouseenter: function (i, x, y)
                    {
                        var item = new DrillCraftingItem(drillState.equippedDrillEquips[i]);
                        var coords = this.getGlobalCoordinates(x, y);
                        showTooltip(
                            _(item.getName()),
                            _(item.getDescription()),
                            coords.x * uiScaleX,
                            coords.y * uiScaleY
                        );
                    }.bind(equipList, i, i * (iconSize + padding), iconSize),
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                "pointer"
            )
            equipHitbox.render = function (parentWindow, i)
            {
                var item = new DrillCraftingItem(drillState.equippedDrillEquips[i]);
                var coords = this.getRelativeCoordinates(0, 0, parentWindow);
                parentWindow.context.drawImage(item.getIcon(), coords.x, coords.y, this.boundingBox.width, this.boundingBox.height);
            }.bind(equipHitbox, this, i);
            equipList.addHitbox(equipHitbox);
        }
        this.equipList = equipList;
        this.addHitbox(equipList);
        if(this.currentTabIndex != 1)
        {
            this.equipList.isEnabled = () => false;
            this.equipList.isVisible = () => false;
        }
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
        return doBigNumberDecimalMultiplication(ingredient.quantity, discount);
    }

    tutorialFlicker()
    {
        // if(!hasCraftedABlueprint && canCraftAnyBlueprint(1))
        // {
        //     this.flickerTab(0, 500);
        //     return true;
        // }
        // else if(tradingPostStructure.level == 0 && canCraftBlueprint(3, 0))
        // {
        //     this.flickerTab(1, 500);
        //     return true;
        // }
        // return false;
    }
}