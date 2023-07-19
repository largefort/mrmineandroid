class PurchaseWindow extends BottomTabbedPopup
{
    layerName = "Purchase"; // Used as key in activeLayers
    domElementId = "PURCHASED"; // ID of dom element that gets shown or hidden
    context = PU;         // Canvas rendering context for popup

    buyButtons = [];
    useButtons = [];

    constructor(boundingBox, worldIndex = 0)
    {
        super(boundingBox); // Need to call base class constructor
        if(!boundingBox)
        {
            this.setBoundingBox();
        }

        this.initializeTabs([_("BUY"), _("USE")]);
        
        var fontToUse = "14px Verdana"
        if(language == "french") {fontToUse = "12px Verdana";}

        if(shopVariantId == 0)
        {
            this.buyButtons.push(this.addHitbox(new Button(
                upgradeb, _("BUY"), fontToUse, "#000000",
                {
                    x: this.boundingBox.width * 0.5 - ticketImage1.width * 1.6,
                    y: ticketImage1.height * 1.6,
                    width: ticketImage1.width,
                    height: 18
                },
                {
                    onmousedown: function ()
                    {
                        platform.buyPack("mrmine_10tickets");
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    }
                },
                'pointer',
                "buyButton1"
            )));

            this.buyButtons.push(this.addHitbox(new Button(
                upgradeb, _("BUY"), fontToUse, "#000000",
                {
                    x: this.boundingBox.width * 0.5 - ticketImage1.width * 0.5,
                    y: ticketImage1.height * 1.6,
                    width: ticketImage1.width,
                    height: 18
                },
                {
                    onmousedown: function ()
                    {
                        platform.buyPack("mrmine_55tickets");
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    }
                },
                'pointer',
                "buyButton2"
            )));

            this.buyButtons.push(this.addHitbox(new Button(
                upgradeb, _("BUY"), fontToUse, "#000000",
                {
                    x: this.boundingBox.width * 0.5 + ticketImage1.width * 0.6,
                    y: ticketImage1.height * 1.6,
                    width: ticketImage1.width,
                    height: 18
                },
                {
                    onmousedown: function ()
                    {
                        platform.buyPack("mrmine_120tickets");
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    }
                },
                'pointer',
                "buyButton3"
            )));

            this.buyButtons.push(this.addHitbox(new Button(
                upgradeb, _("BUY"), fontToUse, "#000000",
                {
                    x: this.boundingBox.width * 0.5 - ticketImage1.width * 1.6,
                    y: ticketImage1.height * 3.1,
                    width: ticketImage1.width,
                    height: 18
                },
                {
                    onmousedown: function ()
                    {
                        platform.buyPack("mrmine_250tickets");
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    }
                },
                'pointer',
                "buyButton4"
            )));

            this.buyButtons.push(this.addHitbox(new Button(
                upgradeb, _("BUY"), fontToUse, "#000000",
                {
                    x: this.boundingBox.width * 0.5 - ticketImage1.width * 0.5,
                    y: ticketImage1.height * 3.1,
                    width: ticketImage1.width,
                    height: 18
                },
                {
                    onmousedown: function ()
                    {
                        platform.buyPack("mrmine_650tickets");
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    },
                    onmouseenter: function ()
                    {
                        showTooltip(_("Buying this ticket pack also grants you the ability to name one of the miners in the game for all Mr.Mine players to see!<br><br>(Added to next update)"), "", mouseX, mouseY);
                    },
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                'pointer',
                "buyButton5"
            )));

            this.buyButtons.push(this.addHitbox(new Button(
                upgradeb, _("BUY"), fontToUse, "#000000",
                {
                    x: this.boundingBox.width * 0.5 + ticketImage1.width * 0.6,
                    y: ticketImage1.height * 3.1,
                    width: ticketImage1.width,
                    height: 18
                },
                {
                    onmousedown: function ()
                    {
                        platform.buyPack("mrmine_1400tickets");
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    },
                    onmouseenter: function ()
                    {
                        showTooltip(_("Buying this ticket pack also grants you the ability to name one of the miners in the game for all Mr.Mine players to see!<br><br>(Added to next update)"), "", mouseX, mouseY);
                    },
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                'pointer',
                "buyButton6"
            )));
        }
        else
        {
            this.buyButtons.push(this.addHitbox(new Hitbox(
                {
                    x: this.bodyContainer.boundingBox.width * .03,
                    y: this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .02),
                    width: this.bodyContainer.boundingBox.width * .3,
                    height: this.bodyContainer.boundingBox.height * .41
                },
                {
                    onmousedown: function ()
                    {
                        platform.buyPack("mrmine_10tickets");
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    }
                },
                "pointer",
                "newBuyButton1"
            )));

            this.buyButtons.push(this.addHitbox(new Hitbox(
                {
                    x: this.bodyContainer.boundingBox.width * .35,
                    y: this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .02),
                    width: this.bodyContainer.boundingBox.width * .3,
                    height: this.bodyContainer.boundingBox.height * .41
                },
                {
                    onmousedown: function ()
                    {
                        platform.buyPack("mrmine_55tickets");
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    }
                },
                "pointer",
                "newBuyButton2"
            )));

            this.buyButtons.push(this.addHitbox(new Hitbox(
                {
                    x: this.bodyContainer.boundingBox.width * .67,
                    y: this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .02),
                    width: this.bodyContainer.boundingBox.width * .3,
                    height: this.bodyContainer.boundingBox.height * .41
                },
                {
                    onmousedown: function ()
                    {
                        platform.buyPack("mrmine_120tickets");
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    }
                },
                "pointer",
                "newBuyButton3"
            )));

            this.buyButtons.push(this.addHitbox(new Hitbox(
                {
                    x: this.bodyContainer.boundingBox.width * .03,
                    y: this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46),
                    width: this.bodyContainer.boundingBox.width * .3,
                    height: this.bodyContainer.boundingBox.height * .41
                },
                {
                    onmousedown: function ()
                    {
                        platform.buyPack("mrmine_250tickets");
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    }
                },
                "pointer",
                "newBuyButton4"
            )));

            this.buyButtons.push(this.addHitbox(new Hitbox(
                {
                    x: this.bodyContainer.boundingBox.width * .35,
                    y: this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46),
                    width: this.bodyContainer.boundingBox.width * .3,
                    height: this.bodyContainer.boundingBox.height * .41
                },
                {
                    onmousedown: function ()
                    {
                        platform.buyPack("mrmine_650tickets");
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    }
                },
                "pointer",
                "newBuyButton5"
            )));

            this.buyButtons.push(this.addHitbox(new Hitbox(
                {
                    x: this.bodyContainer.boundingBox.width * .67,
                    y: this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46),
                    width: this.bodyContainer.boundingBox.width * .3,
                    height: this.bodyContainer.boundingBox.height * .41
                },
                {
                    onmousedown: function ()
                    {
                        platform.buyPack("mrmine_1400tickets");
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    }
                },
                "pointer",
                "newBuyButton6"
            )));
        }
        
        if (!platform.isIOs())
        {
            this.useButtons.push(this.addHitbox(new Button(
                craftb, _("REDEEM"), fontToUse, "#000000",
                {
                    x: purchasedw * .75,
                    y: purchasedh * .94,
                    width: purchasedw * .23,
                    height: purchasedh * .05
                },
                {
                    onmousedown: function ()
                    {
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                        if (platform.isIOs && platform.isIOs())
                        {
                            // store.getAdapter(CdvPurchase.Platform.APPLE_APPSTORE).presentCodeRedemptionSheet()
                        }
                        else
                        {
                            showRedeemPrompt();
                        }
                    }
                },
                "pointer"
            )))
        }

        var chestWidth = this.bodyContainer.boundingBox.width * 0.5;
        var chestHeight = this.bodyContainer.boundingBox.height * 0.45;
        var chestVerticalPadding = this.bodyContainer.boundingBox.height * 0.03

        this.createChestButton(
            ChestType.basic, 
            1, 
            0,
            chestVerticalPadding, 
            chestWidth, 
            chestHeight
        );

        this.createChestButton(
            ChestType.gold, 
            10, 
            chestWidth,
            chestVerticalPadding, 
            chestWidth, 
            chestHeight
        );

        this.createChestButton(
            ChestType.black, 
            25, 
            chestWidth / 2,
            chestHeight + 2 * chestVerticalPadding, 
            chestWidth, 
            chestHeight
        );

        this.onTabChange();
        
        trackEvent_logPurchaseWindowOpen();

        if (!window.store)
        {
            console.log('Store not available');
            return;
        }
        else
        {
            console.log(platform.getPackPrice("mrmine_55tickets"));
        }
    }

    onTabChange()
    {
        for(var i in this.buyButtons)
        {
            this.buyButtons[i].isVisible = () => this.currentTabIndex == 0;
            this.buyButtons[i].isEnabled = () => this.currentTabIndex == 0;
        }
    }

    createChestButton(type, cost, x, y, width, height)
    {
        var container = this.bodyContainer.addHitbox(new Hitbox(
            {
                x: x,
                y: y,
                width: width,
                height: height
            },
            {
            },
            "pointer"
        ));

        container.chestType = type;

        var button = container.addHitbox(new Hitbox(
            {
                x: width * 0.22,
                y: height * 0.75,
                width: width * 0.55,
                height: height * 0.2
            },
            {
            },
            "pointer"
        ));

        button.chestType = container.chestType;

        button.onmousedown = function ()
        {
            if(tickets >= cost)
            {
                if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                var eventDetails;
                switch (this.chestType)
                {
                    case ChestType.basic:
                        eventDetails = "BASIC CHEST";
                        break;
                    case ChestType.gold:
                        eventDetails = "GOLD CHEST";
                        break;
                    case ChestType.black:
                        eventDetails = "BLACK CHEST";
                        break;
                    default:
                        eventDetails = "CHEST";
                }
                // Spawn at depth 0 or search for depth with available miner
                var spawnDepth = 0;
                if (workersHiredAtDepth(spawnDepth > 0))
                {
                    while (chestService.getChestsAtDepth(spawnDepth).length >= workersHiredAtDepth(spawnDepth) 
                        || isDepthWithoutWorkers(spawnDepth))
                    {
                        ++spawnDepth;
                    }
                }
                var chest = chestService.spawnChest(spawnDepth, Chest.purchased, this.chestType);
                chestService.presentChest(chest.depth, chest.worker);
                trackEvent_SpentTickets(cost, eventDetails);
                tickets -= cost;
            } else
            {
                newNews(_("Not enough tickets. You need 10 tickets. You have {0} tickets.", tickets));
            }
        }.bind(button);

        container.render = function()
        {
            var context = this.parent.parent.context;
            var coords = this.getRelativeCoordinates(0, 0, this.parent.parent);
            var chestImage;
            switch (this.chestType)
            {
                case ChestType.basic:
                    chestImage = chest1;
                    break;
                case ChestType.gold:
                    chestImage = chest2;
                    break;
                case ChestType.black:
                    chestImage = chest3;
                    break;
                default:
                    chestImage = chest1;
            }
            drawImageFitInBox(
                context,
                chestImage, 
                coords.x,
                coords.y,
                this.boundingBox.width,
                this.boundingBox.height
            );
            context.font = "26px KanitM";
            context.fillStyle = "#1798c7";
            context.textBaseline = "middle";
            fillTextWrap(
                context,
                _("BUY"), 
                coords.x + this.boundingBox.width * 0.25, 
                coords.y + this.boundingBox.height * 0.85, 
                this.boundingBox.width * 0.50, 
                "center"
            );
        }.bind(container);

        container.isVisible = () => this.currentTabIndex == 1;
        container.isEnabled = () => this.currentTabIndex == 1;
    }

    render()
    {
        this.context.save();
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        this.context.restore();
        super.render();
        
        if(this.currentTabIndex == 0)
        {
            if(shopVariantId == 0)
            {
                this.context.drawImage(ticketImage1, this.boundingBox.width / 2 - ticketImage1.width * 1.6, this.bodyContainer.boundingBox.y);
                this.context.drawImage(ticketImage5, this.boundingBox.width / 2 - ticketImage1.width * 0.5, this.bodyContainer.boundingBox.y);
                this.context.drawImage(ticketImage10, this.boundingBox.width / 2 + ticketImage1.width * 0.6, this.bodyContainer.boundingBox.y);
                this.context.drawImage(ticketImage20, this.boundingBox.width / 2 - ticketImage1.width * 1.6, this.bodyContainer.boundingBox.y + ticketImage1.height * 1.5);
                this.context.drawImage(ticketImage50, this.boundingBox.width / 2 - ticketImage1.width * 0.5, this.bodyContainer.boundingBox.y + ticketImage1.height * 1.5);
                this.context.drawImage(ticketImage100, this.boundingBox.width / 2 + ticketImage1.width * 0.6, this.bodyContainer.boundingBox.y + ticketImage1.height * 1.5);
            }
            else if(shopVariantId == 1)
            {
                this.context.drawImage(v1Tix10, this.bodyContainer.boundingBox.width * .03, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .02), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v1Tix55, this.bodyContainer.boundingBox.width * .35, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .02), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v1Tix120, this.bodyContainer.boundingBox.width * .67, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .02), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v1Tix250, this.bodyContainer.boundingBox.width * .03, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v1Tix650, this.bodyContainer.boundingBox.width * .35, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v1Tix1400, this.bodyContainer.boundingBox.width * .67, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);

                this.context.fillStyle = "#000";
                this.context.font = "24px KanitB";
                fillTextShrinkToFit(this.context, _("BUY"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .37, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("BUY"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .37, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("BUY"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .37, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("BUY"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .81, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("BUY"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .81, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("BUY"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .81, this.bodyContainer.boundingBox.width * .24, "center", 0);
                
                this.context.fillStyle = "#FFF";
                this.context.strokeStyle = "#000";
                this.context.font = "bold 14px Verdana";
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_10tickets"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .28, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_10tickets"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .28, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_55tickets"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .28, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_55tickets"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .28, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_120tickets"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .28, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_120tickets"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .28, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_250tickets"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .72, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_250tickets"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .72, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_650tickets"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .72, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_650tickets"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .72, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_1400tickets"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .72, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_1400tickets"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .72, this.bodyContainer.boundingBox.width * .24, "center", 0);
            }
            else if(shopVariantId == 2)
            {
                this.context.drawImage(v2Tix10, this.bodyContainer.boundingBox.width * .03, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .02), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v2Tix55, this.bodyContainer.boundingBox.width * .35, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .02), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v2Tix120, this.bodyContainer.boundingBox.width * .67, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .02), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v2Tix250, this.bodyContainer.boundingBox.width * .03, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v2Tix650, this.bodyContainer.boundingBox.width * .35, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v2Tix1400, this.bodyContainer.boundingBox.width * .67, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);

                this.context.fillStyle = "#000";
                this.context.font = "24px KanitB";
                fillTextShrinkToFit(this.context, _("BUY"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .37, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("BUY"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .37, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("BUY"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .37, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("BUY"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .81, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("BUY"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .81, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("BUY"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .81, this.bodyContainer.boundingBox.width * .24, "center", 0);
                
                this.context.fillStyle = "#FFF";
                this.context.strokeStyle = "#000";
                this.context.font = "bold 14px Verdana";
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_10tickets"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .28, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_10tickets"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .28, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_55tickets"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .28, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_55tickets"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .28, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_120tickets"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .28, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_120tickets"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .28, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_250tickets"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .72, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_250tickets"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .72, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_650tickets"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .72, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_650tickets"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .72, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_1400tickets"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .72, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_1400tickets"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .72, this.bodyContainer.boundingBox.width * .24, "center", 0);

            }
            else if(shopVariantId == 3)
            {
                this.context.drawImage(v3Tix10, this.bodyContainer.boundingBox.width * .03, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .02), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v3Tix55, this.bodyContainer.boundingBox.width * .35, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .02), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v3Tix120, this.bodyContainer.boundingBox.width * .67, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .02), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v3Tix250, this.bodyContainer.boundingBox.width * .03, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v3Tix650, this.bodyContainer.boundingBox.width * .35, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v3Tix1400, this.bodyContainer.boundingBox.width * .67, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);

                this.context.fillStyle = "#000";
                this.context.font = "24px KanitB";
                fillTextShrinkToFit(this.context, _("BUY"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .37, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("BUY"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .37, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("BUY"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .37, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("BUY"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .81, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("BUY"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .81, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("BUY"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .81, this.bodyContainer.boundingBox.width * .24, "center", 0);
                
                this.context.fillStyle = "#FFF";
                this.context.strokeStyle = "#000";
                this.context.font = "bold 14px Verdana";
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_10tickets"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .28, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_10tickets"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .28, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_55tickets"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .28, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_55tickets"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .28, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_120tickets"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .28, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_120tickets"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .28, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_250tickets"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .72, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_250tickets"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .72, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_650tickets"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .72, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_650tickets"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .72, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_1400tickets"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .72, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_1400tickets"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .72, this.bodyContainer.boundingBox.width * .24, "center", 0);
            }
            else if(shopVariantId == 4)
            {
                this.context.drawImage(v4Tix10, this.bodyContainer.boundingBox.width * .03, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .02), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v4Tix55, this.bodyContainer.boundingBox.width * .35, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .02), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v4Tix120, this.bodyContainer.boundingBox.width * .67, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .02), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v4Tix250, this.bodyContainer.boundingBox.width * .03, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v4Tix650, this.bodyContainer.boundingBox.width * .35, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v4Tix1400, this.bodyContainer.boundingBox.width * .67, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);

                this.context.fillStyle = "#000";
                this.context.font = "24px KanitB";
                fillTextShrinkToFit(this.context, _("BUY"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .37, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("BUY"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .37, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("BUY"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .37, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("BUY"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .81, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("BUY"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .81, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("BUY"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .81, this.bodyContainer.boundingBox.width * .24, "center", 0);
                
                this.context.fillStyle = "#FFF";
                this.context.strokeStyle = "#000";
                this.context.font = "bold 14px Verdana";
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_10tickets"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .28, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_10tickets"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .28, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_55tickets"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .28, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_55tickets"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .28, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_120tickets"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .28, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_120tickets"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .28, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_250tickets"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .72, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_250tickets"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .72, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_650tickets"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .72, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_650tickets"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .72, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_1400tickets"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .72, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_1400tickets"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .72, this.bodyContainer.boundingBox.width * .24, "center", 0);
            }
            else //shopVariantId == 5
            {
                this.context.drawImage(v5Tix10, this.bodyContainer.boundingBox.width * .03, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .02), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v5Tix55, this.bodyContainer.boundingBox.width * .35, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .02), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v5Tix120, this.bodyContainer.boundingBox.width * .67, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .02), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v5Tix250, this.bodyContainer.boundingBox.width * .03, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v5Tix650, this.bodyContainer.boundingBox.width * .35, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v5Tix1400, this.bodyContainer.boundingBox.width * .67, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);

                this.context.fillStyle = "#FFF";
                this.context.strokeStyle = "#000";
                this.context.font = "22px Matiz";
                this.context.lineWidth = 4;

                this.context.fillStyle = "#FFF";
                this.context.shadowColor="black";
                this.context.shadowOffsetX = 1;
                this.context.shadowOffsetY = 4;
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_10tickets"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .38, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_10tickets"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .38, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_55tickets"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .38, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_55tickets"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .38, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_120tickets"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .38, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_120tickets"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .38, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_250tickets"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .82, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_250tickets"), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .82, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_650tickets"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .82, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_650tickets"), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .82, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, platform.getPackPrice("mrmine_1400tickets"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .82, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, platform.getPackPrice("mrmine_1400tickets"), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .82, this.bodyContainer.boundingBox.width * .24, "center", 0);
                
                this.context.lineWidth = 2;
                this.context.shadowOffsetX = 0;
                this.context.shadowOffsetY = 0;
                //this.context.font = "bold 14px Verdana";
                strokeTextShrinkToFit(this.context, _("Pack of {0} tickets", 10), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .07, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("Pack of {0} tickets", 10), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .07, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, _("Pack of {0} tickets", 55), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .07, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("Pack of {0} tickets", 55), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .07, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, _("Pack of {0} tickets", 120), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .07, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("Pack of {0} tickets", 120), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .07, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, _("Pack of {0} tickets", 250), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .51, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("Pack of {0} tickets", 250), this.bodyContainer.boundingBox.width * .06, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .51, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, _("Pack of {0} tickets", 650), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .51, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("Pack of {0} tickets", 650), this.bodyContainer.boundingBox.width * .38, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .51, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, _("Pack of {0} tickets", 1400), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .51, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("Pack of {0} tickets", 1400), this.bodyContainer.boundingBox.width * .70, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .51, this.bodyContainer.boundingBox.width * .24, "center", 0);
            }

            this.context.save();

            if (showShopPurchaseHeaders)
            {
                this.context.textBaseline = "top";
                strokeTextShrinkToFit(this.context, _("Most Popular"), this.bodyContainer.boundingBox.width * .028, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .432, this.bodyContainer.boundingBox.width * .30, "center", 0);
                fillTextShrinkToFit(this.context, _("Most Popular"), this.bodyContainer.boundingBox.width * .028, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .432, this.bodyContainer.boundingBox.width * .30, "center", 0);
            
                strokeTextShrinkToFit(this.context, _("Best Value"), this.bodyContainer.boundingBox.width * .67, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .432, this.bodyContainer.boundingBox.width * .30, "center", 0);
                fillTextShrinkToFit(this.context, _("Best Value"), this.bodyContainer.boundingBox.width * .67, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .432, this.bodyContainer.boundingBox.width * .30, "center", 0);
            }

            this.context.fillStyle = "#FFFFFF";
            this.context.font = "24px KanitM";
            this.context.textBaseline = "middle";
            var box = drawImageFitInBox(
                this.context,
                smallShopTicket, 
                purchasedw * 0.025, 
                purchasedh * 0.93, 
                purchasedw * .09, 
                purchasedh * .05
            );
            this.context.fillText(
                "x" + tickets, 
                box.x + box.width + purchasedw * 0.0125, 
                box.y + box.height / 2
            );
            this.context.restore();
        }
        else
        {
            this.context.save();
            this.context.fillStyle = "#FFFFFF";
            this.context.font = "24px KanitM";
            this.context.textBaseline = "middle";
            var box = drawImageFitInBox(
                this.context,
                smallShopTicket, 
                purchasedw * 0.025, 
                purchasedh * 0.93, 
                purchasedw * .09, 
                purchasedh * .05
            );
            this.context.fillText(
                "x" + tickets, 
                box.x + box.width + purchasedw * 0.0125, 
                box.y + box.height / 2
            );
            this.context.restore();
        }
    }
}