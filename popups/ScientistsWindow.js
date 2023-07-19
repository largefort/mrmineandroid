class ScientistsWindow extends BottomTabbedPopup
{
    layerName = "Arch"; // Used as key in activeLayers
    domElementId = "ARCHD"; // ID of dom element that gets shown or hidden
    context = ARCH;         // Canvas rendering context for popup

    scientistsPane;
    relicsPane;

    buttonHitboxes;

    constructor(boundingBox)
    {
        super(boundingBox); // Need to call base class constructor
        if(!boundingBox)
        {
            this.setBoundingBox();
        }

        var tabCategories = {
            0: _("Scientist 1"),
            1: _("Scientist 2"),
            2: _("Scientist 3"),
            3: _("Relics")
        }

        this.initializeTabs(Object.values(tabCategories));
        this.initializeTabNotifications([
            [notificationManager.NOTIFICATION_IDS.isScientist1Dead, notificationManager.NOTIFICATION_IDS.isScientist1Ready],
            [notificationManager.NOTIFICATION_IDS.isScientist2Dead, notificationManager.NOTIFICATION_IDS.isScientist2Ready],
            [notificationManager.NOTIFICATION_IDS.isScientist3Dead, notificationManager.NOTIFICATION_IDS.isScientist3Ready]
        ])
        this.backgroundImage = scientistbg;

        this.scientistsPane = new Hitbox(
            {
                x: 0,
                y: 0,
                width: this.boundingBox.width,
                height: this.boundingBox.height
            },
            {},
            "",
            "scientistPane"
        );
        this.scientistsPane.allowBubbling = true;
        this.scientistsPane.isVisible = () => this.currentTabIndex < 3;
        this.scientistsPane.isEnabled = () => this.currentTabIndex < 3;
        this.addHitbox(this.scientistsPane);

        this.relicsPane = new Hitbox(
            {
                x: 0,
                y: 0,
                width: this.boundingBox.width,
                height: this.boundingBox.height
            },
            {},
            "",
            "relicsPane"
        );
        this.relicsPane.allowBubbling = true;
        this.relicsPane.isVisible = () => this.currentTabIndex == 3;
        this.relicsPane.isEnabled = () => this.currentTabIndex == 3;
        this.addHitbox(this.relicsPane);
        this.initializeScientistHitboxes();
        this.initializeRelicsHitboxes();

        this.onTabChange();
    }

    initializeScientistHitboxes()
    {
        var scientistIndex = this.currentTabIndex;
        var activeScientist = activeScientists[scientistIndex];

        if(activeScientist.length == 0)
        {
            //No hitboxes
            return;
        }
        else
        {
            var buryAndCollectButton = new Hitbox(
                {
                    x: this.boundingBox.width * .375,
                    y: this.boundingBox.height * .79,
                    width: this.boundingBox.width * .25,
                    height: this.boundingBox.height * .1
                },
                {
                    onmousedown: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(isOnActiveExcavation(scientistIndex))
                        {
                            if(isScientistDead(scientistIndex))
                            {
                                onClickBuryScientist(scientistIndex);
                            }
                            else if(isExcavationDone(scientistIndex))
                            {
                                onClickClaimExcavationReward(scientistIndex);
                            }
                            if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                        }
                    },
                    onmouseenter: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(isOnActiveExcavation(scientistIndex))
                        {
                            if(isScientistDead(scientistIndex) || isExcavationDone(scientistIndex))
                            {
                                this.cursor = 'pointer';
                            }
                        }
                    }
                },
                "default",
                "buryAndCollectButton"
            );
            this.scientistsPane.addHitbox(buryAndCollectButton);

            var forfeitButton = new Hitbox(
                {
                    x: this.boundingBox.width * .375,
                    y: this.boundingBox.height * .9,
                    width: this.boundingBox.width * .25,
                    height: this.boundingBox.height * .1
                },
                {
                    onmousedown: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(isOnActiveExcavation(scientistIndex))
                        {
                            if(isExcavationDone(scientistIndex) && !isScientistDead(scientistIndex))
                            {
                                confirmForfeitExcavation(scientistIndex);
                            }
                            else if(isScientistDead(scientistIndex))
                            {
                                onClickResurrect(scientistIndex);
                            }
                            if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                        }
                    },
                    onmouseenter: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(isOnActiveExcavation(scientistIndex))
                        {
                            if(isExcavationDone(scientistIndex) && !isScientistDead(scientistIndex))
                            {
                                showTooltip(_("Forfeit Reward"), _("Forfeit your reward if you cannot claim it or do not want to claim it."));
                                this.cursor = 'pointer';
                            }
                            else if(isScientistDead(scientistIndex))
                            {
                                showTooltip(_("Resurrect Scientist"), _("Resurrect {0} for {1} tickets", scientists[activeScientists[scientistIndex][0]].name, getCostToResurrect(scientistIndex)));
                                this.cursor = 'pointer';
                            }
                        }
                    },
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                "default",
                "forfeitButton"
            );
            this.scientistsPane.addHitbox(forfeitButton);

            var refreshButton = new Hitbox(
                {
                    x: this.boundingBox.width * .45,
                    y: this.boundingBox.height * .85,
                    width: this.boundingBox.height * .12,
                    height: this.boundingBox.height * .12
                },
                {
                    onmousedown: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(!isOnActiveExcavation(scientistIndex))
                        {
                            confirmRerollExcavations(scientistIndex);
                            if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                        }
                    },
                    onmouseenter: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(!isOnActiveExcavation(scientistIndex))
                        {
                            showTooltip(_("Refresh Excavations"), _("Pay 1 ticket to get two new excavation options"));
                            this.cursor = 'pointer';
                        }
                    },
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                "default",
                "forfeitButton"
            )
            refreshButton.isEnabled = () => !isOnActiveExcavation(this.currentTabIndex);
            refreshButton.isVisible = () => !isOnActiveExcavation(this.currentTabIndex);
            this.scientistsPane.addHitbox(refreshButton);

            var leftStartButton = new Hitbox(
                {
                    x: this.boundingBox.width * .1275,
                    y: this.boundingBox.height * .85,
                    width: this.boundingBox.width * .25,
                    height: this.boundingBox.height * .12
                },
                {
                    onmousedown: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(!isOnActiveExcavation(scientistIndex) && !isScientistDead(scientistIndex))
                        {
                            startExcavation(scientistIndex, 0);
                            if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                        }
                    },
                    onmouseenter: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(!isOnActiveExcavation(scientistIndex) && !isScientistDead(scientistIndex))
                        {
                            this.cursor = 'pointer';
                        }
                    }
                },
                "default",
                "leftStartButton"
            );
            this.scientistsPane.addHitbox(leftStartButton);

            var rightStartButton = new Hitbox(
                {
                    x: this.boundingBox.width * .6225,
                    y: this.boundingBox.height * .85,
                    width: this.boundingBox.width * .25,
                    height: this.boundingBox.height * .12
                },
                {
                    onmousedown: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(!isOnActiveExcavation(scientistIndex))
                        {
                            startExcavation(scientistIndex, 1);
                            if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                        }
                    },
                    onmouseenter: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(!isOnActiveExcavation(scientistIndex))
                        {
                            this.cursor = 'pointer';
                        }
                    }
                },
                "default",
                "rightStartButton"
            );
            this.scientistsPane.addHitbox(rightStartButton);

            var rewardOption1Icon = new Hitbox(
                {
                    x: this.boundingBox.width * .185,
                    y: this.boundingBox.height * .66,
                    width: this.boundingBox.height * .16,
                    height: this.boundingBox.height * .16
                },
                {
                    onmouseenter: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(firstOpenScientistSlot() > scientistIndex && !isOnActiveExcavation(scientistIndex))
                        {
                            if(!isOnActiveExcavation(scientistIndex))
                            {
                                var rewardInfo = getExcavationChoiceRewardValues(scientistIndex, 0);
                                showTooltip(rewardInfo.name, rewardInfo.description);
                                this.cursor = 'pointer';
                            }
                        }
                    },
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                "default",
                "rewardOption1Icon"
            );
            this.scientistsPane.addHitbox(rewardOption1Icon);

            var rewardOption2Icon = new Hitbox(
                {
                    x: this.boundingBox.width * .68,
                    y: this.boundingBox.height * .66,
                    width: this.boundingBox.height * .16,
                    height: this.boundingBox.height * .16
                },
                {
                    onmouseenter: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(firstOpenScientistSlot() > scientistIndex && !isOnActiveExcavation(scientistIndex))
                        {
                            if(!isOnActiveExcavation(scientistIndex))
                            {
                                var rewardInfo = getExcavationChoiceRewardValues(scientistIndex, 1);
                                showTooltip(rewardInfo.name, rewardInfo.description);
                                this.cursor = 'pointer';
                            }
                        }
                    },
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                "default",
                "rewardOption2Icon"
            );
            this.scientistsPane.addHitbox(rewardOption2Icon);
            this.scientistsPane.addHitbox(rewardOption1Icon);

            var rewardActive = new Hitbox(
                {
                    x: this.boundingBox.width * .45,
                    y: this.boundingBox.height * .46,
                    width: this.boundingBox.width * .1,
                    height: this.boundingBox.height * .15
                },
                {
                    onmouseenter: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(firstOpenScientistSlot() > scientistIndex && isOnActiveExcavation(scientistIndex))
                        {
                            if(isOnActiveExcavation(scientistIndex))
                            {
                                var rewardInfo = getActiveExcavationRewardValues(scientistIndex);
                                showTooltip(rewardInfo.name, rewardInfo.description);
                                this.cursor = 'pointer';
                            }
                        }
                    },
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                "default",
                "rewardActive"
            );
            this.scientistsPane.addHitbox(rewardActive);
        }
    }

    
    onTabChange()
    {
        if(this.currentTabIndex < 3)
        {
            if(!isOnActiveExcavation(this.currentTabIndex))
            {
                refreshButton.isEnabled = () => true;
                refreshButton.isVisible = () => true;
            }
            else
            {
                refreshButton.isEnabled = () => false;
                refreshButton.isVisible = () => false;
            }
            notificationManager.markAllAsSeen([
                notificationManager.NOTIFICATION_IDS["isScientist" + (this.currentTabIndex + 1) + "Ready"],
                notificationManager.NOTIFICATION_IDS["isScientist" + (this.currentTabIndex + 1) + "Dead"],
            ]);
        }
    }

    initializeRelicsHitboxes()
    {
        var cellWidth = .14;
        var cellHeight = .21;
        var cellsPerRow = 5;
        var xOffset = .15 * this.boundingBox.width;
        var yOffset = .16 * this.boundingBox.height;
        for(var i = 0; i < absoluteMaxRelicSlots; i++)
        {
            var x = (cellWidth * this.boundingBox.width * (i % cellsPerRow)) + xOffset;
            var y = (cellHeight * this.boundingBox.height * Math.floor(i / cellsPerRow)) + yOffset;

            this.context.strokeRect(x, y, this.boundingBox.width * cellWidth, this.boundingBox.height * cellHeight);

            var relicHitbox = new Hitbox(
                {
                    x: x,
                    y: y,
                    width: this.boundingBox.width * cellWidth,
                    height: this.boundingBox.height * cellHeight
                },
                {
                    onmouseenter: function ()
                    {
                        var relicIndex = parseInt(this.id.split("_")[1]);
                        if(equippedRelics[relicIndex] > -1)
                        {
                            this.cursor = 'pointer';
                            showTooltipForRelic(relicIndex);
                        }
                    },
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    },
                    onmousedown: function ()
                    {
                        var relicIndex = parseInt(this.id.split("_")[1]);
                        if(equippedRelics[relicIndex] > -1)
                        {
                            if(relicEditMode == 1)
                            {
                                if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                                showConfirmationPrompt(
                                    _("Are you sure you want to delete this relic?"),
                                    _("Yes"),
                                    function ()
                                    {
                                        deleteEquippedRelic(relicIndex);
                                        hideSimpleInput();
                                    },
                                    _("Cancel")
                                );
                                relicEditMode = 0;
                            }
                        }
                    }
                },
                "default",
                "relicHitbox_" + i
            );
            this.relicsPane.addHitbox(relicHitbox);
        }

        var relicTrashHitbox = new Hitbox(
            {
                x: this.boundingBox.width * .425,
                y: this.boundingBox.height * .83,
                width: this.boundingBox.width * .15,
                height: this.boundingBox.height * .17
            },
            {
                onmouseenter: function ()
                {
                    this.cursor = 'pointer';
                    if(relicEditMode == 0)
                    {
                        if(isMobile())
                        {
                            showTooltip(_("Trash"), _("Currently not set to delete, tap this to toggle relic deletion mode."));
                        }
                        else
                        {
                            showTooltip(_("Trash"), _("Currently not set to delete, click this to toggle relic deletion mode."));
                        }
                    }
                    else
                    {
                        if(isMobile())
                        {
                            showTooltip(_("Trash"), _("Currently not set to delete, tap this to toggle relic deletion mode."));
                        }
                        else
                        {
                            showTooltip(_("Trash"), _("Currently not set to delete, click this to toggle relic deletion mode."));
                        }
                    }
                },
                onmouseexit: function ()
                {
                    hideTooltip();
                },
                onmousedown: function ()
                {
                    if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    if(relicEditMode == 1)
                    {
                        relicEditMode = 0;
                    }
                    else
                    {
                        relicEditMode = 1;
                    }
                }
            },
            "default",
            "relicTrashHitbox"
        );
        this.relicsPane.addHitbox(relicTrashHitbox);
    }

    getRarityColor(rarity)
    {
        if(rarity == "Common") return "#38b53a";
        else if(rarity == "Uncommon") return "#008dd9";
        else if(rarity == "Rare") return "#9c2828";
        else if(rarity == "Legendary") return "#ebab34";
    }

    getDifficultyColor(difficulty)
    {
        if(difficulty == "Easy") return "#46eb49";
        else if(difficulty == "Medium") return "#ecf759";
        else if(difficulty == "Hard") return "#fc8608";
        else if(difficulty == "Nightmare") return "#d1000a";
    }

    render()
    {
        this.context.save();
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        this.context.restore();
        super.render(); // Render any child layers

        //Scientists tab
        if(this.currentTabIndex < 3)
        {
            var scientistIndex = this.currentTabIndex;
            var activeScientist = activeScientists[scientistIndex];
            if(activeScientist.length == 0)
            {
                var titleText = _("You do not have {0} scientists, you need to unlock more.", (scientistIndex + 1));
                this.context.fillText(titleText, this.boundingBox.width * .5 - this.context.measureText(titleText).width / 2, this.boundingBox.height * .25);
                if(language == "english")
                {
                    var howToGetText = _("Find more scientists from chests.");
                    this.context.fillText(howToGetText, this.boundingBox.width * .5 - this.context.measureText(howToGetText).width / 2, this.boundingBox.height * .30);
                }
            }
            else
            {
                var staticScientist = scientists[activeScientist[0]];
                var imageId = staticScientist.image;

                this.context.drawImage(characterInfoFrame, 0, 0, characterInfoFrame.width, characterInfoFrame.height, this.boundingBox.x, this.boundingBox.height * .130, this.boundingBox.width, this.boundingBox.height * .26);
                this.context.fillStyle = "#211A14"
                this.context.fillRect(this.boundingBox.width * .02, this.boundingBox.height * .1325, this.boundingBox.width * .2, this.boundingBox.height * .21);

                if(isScientistDead(scientistIndex))
                {
                    if(scientistIndex == 1 || scientistIndex == 3)
                    {
                        this.context.drawImage(death1, 0, 0, death1.width, death1.height, this.boundingBox.width * .02, this.boundingBox.height * .14, this.boundingBox.width * .20, this.boundingBox.height * .20);
                    }
                    else
                    {
                        this.context.drawImage(death2, 0, 0, death2.width, death2.height, this.boundingBox.width * .02, this.boundingBox.height * .14, this.boundingBox.width * .20, this.boundingBox.height * .20);
                    }
                }
                else
                {
                    this.context.drawImage(imageId, 0, 0, imageId.width, imageId.height, this.boundingBox.width * .02, this.boundingBox.height * .14, this.boundingBox.width * .20, this.boundingBox.height * .20);
                }

                var nameText = staticScientist.name;
                this.context.fillStyle = "#FFFFFF"
                this.context.font = "18px Verdana";
                this.context.fillText(nameText, this.boundingBox.width * .24, this.boundingBox.height * .19);
                this.context.fillRect(this.boundingBox.width * .24, (this.boundingBox.height * .2), this.context.measureText(nameText).width, 1);
                this.context.font = "16px Verdana";
                var titleText1 = _("Lvl") + " " + getScientistLevel(scientistIndex) + " (" + Math.floor(getScientistPercentToNextLevel(scientistIndex) * 100) + "%)";
                renderFancyProgressBar(
                    this.context,
                    titleText1,
                    getScientistPercentToNextLevel(scientistIndex),
                    this.boundingBox.width * .24,
                    this.boundingBox.height * .21,
                    this.boundingBox.width * .55,
                    this.boundingBox.height * .07,
                    "#76E374",
                    "#000000",
                    "#FFFFFF",
                    timerFrame
                );

                this.context.fillStyle = this.getRarityColor(staticScientist.rarity);
                var titleText2 = _("Rarity: {0}", staticScientist.rarity);
                this.context.fillText(titleText2, this.boundingBox.width * .24, this.boundingBox.height * .33);
                this.context.fillStyle = "#FFFFFF";
                this.context.font = "14px Verdana";

                if(isOnActiveExcavation(scientistIndex))
                {
                    var activeExcavation = activeExcavations[scientistIndex];
                    var staticExcavation = excavations[activeExcavation[5]];
                    var difficultyText = staticExcavation.difficulty;
                    this.context.fillStyle = this.getDifficultyColor(difficultyText);
                    this.context.font = "bold 12px Verdana";
                    var excavationText = getActiveExcavationText(scientistIndex);
                    this.context.fillText(excavationText, this.boundingBox.width * .5 - this.context.measureText(excavationText).width / 2, this.boundingBox.height * .435);
                    this.context.fillStyle = "#FFFFFF";
                    this.context.font = "14px Verdana";

                    var excavationRewardValues = getActiveExcavationRewardValues(scientistIndex);


                    this.context.save();
                    this.context.fillStyle = "rgba(255, 255, 255, 0.1)";
                    this.context.fillRect(this.boundingBox.width * .45, this.boundingBox.height * .46, this.boundingBox.width * .1, this.boundingBox.height * .15);
                    this.context.restore();

                    if(excavationRewardValues.id > -1)
                    {
                        excavationRewards[excavationRewardValues.id].renderFunction(this.context, excavationRewardValues.id, this.boundingBox.width * .45, this.boundingBox.height * .46, this.boundingBox.width * .1, this.boundingBox.height * .15);
                    }
                    else
                    {
                        this.context.drawImage(darkdot, 0, 0, darkdot.width, darkdot.height, this.boundingBox.width * .45, this.boundingBox.height * .46, this.boundingBox.width * .1, this.boundingBox.height * .15);
                    }

                    var rewardText = excavationRewardValues.name;
                    this.context.fillText(rewardText, this.boundingBox.width * .5 - this.context.measureText(rewardText).width / 2, this.boundingBox.height * .66);

                    var percentComplete = excavationPercentComplete(scientistIndex);
                    var remainingTime = excavationTimeRemainingSeconds(scientistIndex);

                    if(isScientistDead(scientistIndex))
                    {
                        var deathReason = getDeathReason(scientistIndex);
                        renderProgressBar(this.context, deathReason, darkdot, darkdot, this.boundingBox.width * .2, this.boundingBox.height * .70, this.boundingBox.width * .6, this.boundingBox.height * .08, "#CC3333", percentComplete);
                        renderButton(this.context, craftb, _("BURY"), this.boundingBox.width * .375, this.boundingBox.height * .79, this.boundingBox.width * .25, this.boundingBox.height * .1, "14px Verdana", "#000000");
                        renderButton(this.context, craftb, _("RESURRECT"), this.boundingBox.width * .375, this.boundingBox.height * .9, this.boundingBox.width * .25, this.boundingBox.height * .1, "14px Verdana", "#000000");
                    }
                    else if(isExcavationDone(scientistIndex))
                    {
                        renderProgressBar(this.context, _("Excavation Complete"), darkdot, darkdot, this.boundingBox.width * .2, this.boundingBox.height * .69, this.boundingBox.width * .6, this.boundingBox.height * .08, "#22CC22", 1);
                        renderButton(this.context, craftb, _("COLLECT"), this.boundingBox.width * .375, this.boundingBox.height * .79, this.boundingBox.width * .25, this.boundingBox.height * .1, "14px Verdana", "#000000");
                        renderButton(this.context, craftb, _("FORFEIT"), this.boundingBox.width * .375, this.boundingBox.height * .9, this.boundingBox.width * .25, this.boundingBox.height * .1, "14px Verdana", "#000000");
                    }
                    else
                    {
                        renderProgressBar(this.context, _("Time Remaining: {0}", formattedCountDown(remainingTime)), greydot, darkdot, this.boundingBox.width * .2, this.boundingBox.height * .70, this.boundingBox.width * .6, this.boundingBox.height * .08, "#FFFFFF", percentComplete);
                    }
                }
                else
                {
                    for(var i = 0; i < 2; i++)
                    {
                        var excavationChoice = excavationChoices[scientistIndex][i];
                        var excavationStaticData = excavations[excavationChoice[0]];
                        var excavationName = excavationStaticData.names[excavationChoice[5]];
                        var deathChance = Math.max(0, Math.round(excavationChoice[2] * staticScientist.deathChanceMultiple).toFixed(0) - STAT.increasedExcavationSuccessRatePercent());
                        var difficultyText = excavationStaticData.difficulty;
                        var isRewardShown = excavationChoice[3];
                        var rewardId = excavationChoice[4];
                        var excavationDurationMinutes = excavationChoice[1];
                        var rewardStaticData = excavationRewards[rewardId];
                        var rewardImagecurrentlyViewedDepth = rewardStaticData.image;
                        var rewardImageRenderFunction = rewardStaticData.renderFunction;
                        var rewardName = rewardStaticData.name;
                        var rewardDescription = rewardStaticData.description;
                        var offset = (this.boundingBox.width * 0.01) + (i * this.boundingBox.width * .48);

                        //render the choice
                        this.context.font = "15px KanitB";
                        this.context.fillStyle = this.getDifficultyColor(difficultyText);
                        fillTextShrinkToFit(this.context, excavationName, offset, this.boundingBox.height * .44, this.boundingBox.width * 0.48, "center");

                        this.context.font = "13px Verdana";
                        this.context.fillStyle = "rgba(255, 255, 255, 0.7)";
                        fillTextShrinkToFit(this.context, _("Death Chance: {0}", deathChance + "%"), offset, this.boundingBox.height * .49, this.boundingBox.width * 0.48, "center");
                        var durationText = formattedCountDown(excavationDurationMinutes * 60).slice(0, 5);
                        this.context.fillText(durationText, offset + this.boundingBox.width * .25 - this.context.measureText(durationText).width / 2, this.boundingBox.height * .54);
                        this.context.fillStyle = "#FFFFFF";
                        this.context.fillRect(offset + (this.boundingBox.width * 0.07), this.boundingBox.height * .57, this.boundingBox.width * .35, this.boundingBox.height * .003);


                        if(isRewardShown)
                        {
                            this.context.save();
                            this.context.fillStyle = "rgba(255, 255, 255, 0.1)";
                            this.context.fillRect(offset + this.boundingBox.width * .1825, this.boundingBox.height * .65, this.boundingBox.height * .16, this.boundingBox.height * .16);
                            this.context.restore();

                            var tempFont = this.context.font;
                            this.context.font = "14px Verdana";
                            var rewardText = rewardName;
                            fillTextShrinkToFit(this.context, rewardText, offset, this.boundingBox.height * .62, this.boundingBox.width * 0.48, "center");
                            this.context.font = tempFont;

                            rewardImageRenderFunction(this.context, rewardId, offset + this.boundingBox.width * .1825, this.boundingBox.height * .655, this.boundingBox.height * .16, this.boundingBox.height * .16);

                        }
                        else
                        {
                            this.context.save();
                            this.context.fillStyle = "rgba(255, 255, 255, 0.1)";
                            this.context.fillRect(offset + this.boundingBox.width * .1825, this.boundingBox.height * .65, this.boundingBox.height * .16, this.boundingBox.height * .16);
                            this.context.restore();

                            this.context.fillText("???", offset + this.boundingBox.width * .1825 + (this.boundingBox.width * .14 / 2) - this.context.measureText("???").width / 2, this.boundingBox.height * .68 + this.boundingBox.height * .13 / 2);
                            var tempFont = this.context.font;
                            this.context.font = "14px Verdana";
                            var rewardText = "???";
                            this.context.fillText(rewardText, offset + this.boundingBox.width * .25 - this.context.measureText(rewardText).width / 2, this.boundingBox.height * .62);
                            this.context.font = tempFont;
                        }

                        renderButton(this.context, startButton, _("START"), offset + this.boundingBox.width * .125, this.boundingBox.height * .85, this.boundingBox.width * .25, this.boundingBox.height * .12, "20px Verdana", "#000000");
                        this.context.drawImage(refreshButton, 0, 0, refreshButton.width, refreshButton.height, (this.boundingBox.width * 0.45), this.boundingBox.height * .85, this.boundingBox.height * .12, this.boundingBox.height * .12);
                    }
                }
            }
        }
        else
        {
            var cellWidth = .14;
            var cellHeight = .21;
            var cellsPerRow = 5;
            var xOffset = .15 * this.boundingBox.width;
            var yOffset = .16 * this.boundingBox.height;
            for(var i = 0; i < maxRelicSlots; i++)
            {
                var x = (cellWidth * this.boundingBox.width * (i % cellsPerRow)) + xOffset;
                var y = (this.boundingBox.width * cellWidth * Math.floor(i / cellsPerRow)) + yOffset;
                var rewardId = equippedRelics[i];
                this.context.strokeStyle = "rgba(255, 255, 255, 1)";
                this.context.strokeRect(x, y, this.boundingBox.width * cellWidth, this.boundingBox.width * cellWidth);
                if(rewardId == -1)
                {
                    this.context.save();
                    this.context.fillStyle = "rgba(255, 255, 255, 0.3)";
                    this.context.fillRect(x, y, this.boundingBox.width * cellWidth, this.boundingBox.width * cellWidth);
                    this.context.restore();
                }
                else
                {
                    var relicImage = excavationRewards[rewardId].image;
                    this.context.save();
                    this.context.fillStyle = "rgba(255, 255, 255, 0.3)";
                    this.context.fillRect(x, y, this.boundingBox.width * cellWidth, this.boundingBox.width * cellWidth);
                    this.context.restore();

                    excavationRewards[rewardId].renderFunction(this.context, rewardId, x, y, this.boundingBox.width * cellWidth, this.boundingBox.width * cellWidth);
                }
            }

            if(relicEditMode == 0)
            {
                this.context.drawImage(trashb, 0, 0, 20, 20, this.boundingBox.width * .425, this.boundingBox.height * .83, this.boundingBox.width * .15, this.boundingBox.height * .17);
            }
            else
            {
                this.context.drawImage(trashb2, 0, 0, 20, 20, this.boundingBox.width * .425, this.boundingBox.height * .83, this.boundingBox.width * .15, this.boundingBox.height * .17);
            }
        }
    }
}
