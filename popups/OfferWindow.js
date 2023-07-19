class OfferWindow extends PopupWindow
{
    layerName = "offerWindow"; // Used as key in activeLayers
    domElementId = "CONFIRMATIOND";
    context = CON;  // Canvas rendering context for popup
    zIndex = 999;

    openTimestamp = "";

    // Relative to screen size
    popupWidth = 0.85;
    popupHeight = 0.7;

    // Relative to popup size
    bodyPadding = 0.02;
    headerHeight = 0.075;
    bodyHeight = 0.73;
    footerHeight = 0.17;

    // Relative to body size
    imageHeight = 0.5;
    rewardListHeight = 0.25;

    frameWidth = 70;


    constructor(boundingBox)
    {
        super(boundingBox);
        this.setBoundingBox();

        this.initHitboxes();
        offerManager.hasSeenOffer = true;
    }

    initHitboxes()
    {
        this.clearHitboxes();
        this.createPopup();
        this.createHeader();
        this.createBody();
        this.createFooter();
    }

    createPopup()
    {
        this.popup = this.addHitbox(new Hitbox(
            {
                x: (this.boundingBox.width * (1 - this.popupWidth)) / 2,
                y: (this.boundingBox.height * (1 - this.popupHeight)) / 2,
                width: this.boundingBox.width * this.popupWidth,
                height: this.boundingBox.height * this.popupHeight
            },
            {},
            ""
        ));

        this.popup.render = function ()
        {
            var popupFrameWidth = 141;
            var renderedFrameWidth = this.parent.frameWidth;
            var shadowWidth = 0;
            var shadowHeight = 0;

            var coords = this.getRelativeCoordinates(0, 0, this.parent);
            var context = this.parent.context;
            context.drawImage(
                lilpopupBackground,
                coords.x + renderedFrameWidth * 0.34,
                coords.y + renderedFrameWidth * 0.34,
                this.boundingBox.width - 2 * renderedFrameWidth * 0.34,
                this.boundingBox.height - 2 * renderedFrameWidth * 0.34
            );
            drawFrame(
                context,
                goldframe,
                coords.x,
                coords.y,
                this.boundingBox.width,
                this.boundingBox.height,
                renderedFrameWidth,
                popupFrameWidth,
                shadowHeight,
                shadowWidth
            )
            this.renderChildren();
        }

        // Used to account for the fact that the banner and frame are one asset
        var frameWidthMultiplier = 0.34;
        var padding = this.boundingBox.width * this.bodyPadding + this.frameWidth * frameWidthMultiplier;
        this.bodyContainer = this.popup.addHitbox(new Hitbox(
            {
                x: padding,
                y: padding,
                width: this.popup.boundingBox.width - 2 * padding,
                height: this.popup.boundingBox.height - 2 * padding
            },
            {},
            ""
        ));

        this.closeButton = this.addHitbox(new Button(
            closei, "", "", "",
            {
                x: this.popup.boundingBox.x + this.popup.boundingBox.width * .94,
                y: this.popup.boundingBox.y,
                width: this.boundingBox.width * .05,
                height: this.boundingBox.width * .05
            },
            {
                onmousedown: function ()
                {
                    closeUi(this.parent);
                    if(!mutebuttons) closeAudio[rand(0, closeAudio.length - 1)].play();
                }
            },
            'pointer',
            "closeButton"
        ));
    }

    createHeader()
    {
        this.header = this.bodyContainer.addHitbox(new Hitbox(
            {
                x: 0,
                y: -this.boundingBox.height * 0.015,
                width: this.bodyContainer.boundingBox.width,
                height: this.bodyContainer.boundingBox.height * this.headerHeight
            },
            {},
            ""
        ));

        this.header.render = function()
        {
            var root = this.getRootLayer();
            var offer = root.getOffer();
            var coords = this.getRelativeCoordinates(0, 0, root);
            var context = root.context;
            var titleTextSize = Math.floor(this.boundingBox.height * 0.65);
            context.save();
            context.font = titleTextSize + "px KanitB";
            context.fillStyle = "#FFFFFF";
            context.strokeStyle = "#000000";
            context.lineWidth = 3;
            context.textBaseline = "top";
            strokeTextWrapWithHeightLimit(
                context,
                offer.name,
                coords.x,
                coords.y,
                this.boundingBox.width,
                titleTextSize,
                "center",
                0.07
            );
            var nameText = fillTextWrapWithHeightLimit(
                context,
                offer.name,
                coords.x,
                coords.y,
                this.boundingBox.width,
                titleTextSize,
                "center",
                0.07
            );

            var countdownTextSize = this.boundingBox.height * 0.97 - nameText.height;

            context.font = countdownTextSize + "px KanitB";
            context.lineWidth = 2;
            context.textBaseline = "top";
            var countdown = formattedCountDown(offerManager.getTimeRemainingForOffer());
            var countdownY = nameText.y2 + this.boundingBox.height * 0.03;
            strokeTextWrapWithHeightLimit(
                context,
                countdown,
                coords.x,
                countdownY,
                this.boundingBox.width,
                countdownTextSize,
                "center",
                0.07
            );
            fillTextWrapWithHeightLimit(
                context,
                countdown,
                coords.x,
                countdownY,
                this.boundingBox.width,
                countdownTextSize,
                "center",
                0.07
            );
            context.restore();
        }
    }

    createBody()
    {
        this.body = this.bodyContainer.addHitbox(new Hitbox(
            {
                x: 0,
                y: this.headerHeight * this.bodyContainer.boundingBox.height,
                width: this.bodyContainer.boundingBox.width,
                height: this.bodyHeight * this.bodyContainer.boundingBox.height
            },
            {}
        ));

        this.body.render = function()
        {
            var root = this.getRootLayer();
            var offer = root.getOffer();
            var coords = this.getRelativeCoordinates(0, 0, root);
            var context = root.context;
            var imageHeight = 0.8;
            var padding = 0.03 * this.boundingBox.height;
            context.save();
            var imageBox = drawImageFitInBox(
                context,
                offer.image,
                coords.x,
                coords.y,
                this.boundingBox.width,
                this.boundingBox.height * imageHeight
            );
            root.drawBox(
                imageBox.x,
                imageBox.y,
                imageBox.width,
                imageBox.height,
                5,
                0
            );

            context.fillStyle = "#f2301a";
            context.strokeStyle = "#f2301a";
            context.lineWidth = 1;
            context.shadowColor = "rgba(0,0,0,0.8)";
            context.shadowBlur = 3;
            context.shadowOffsetX = 3;
            context.shadowOffsetY = 2;

            var starRadius = (imageBox.x - root.popup.boundingBox.x) * 0.9;
            var starX = imageBox.x + starRadius * 0.3;
            var starY = imageBox.y + starRadius * 0.3;
            var textAngle = -Math.PI * 0.17;
            var textWidth = starRadius * 3;

            root.drawStar(
                context,
                starX,
                starY,
                13,
                starRadius,
                starRadius * 0.7
            )

            context.fillStyle = "#FFFFFF";
            context.strokeStyle = "#000000";
            context.lineWidth = 2;
            context.font = starRadius + "px KanitB";
            context.textBaseline = "middle";
            context.translate(starX, starY);
            context.rotate(textAngle);
            strokeTextShrinkToFit(
                context,
                offer.valueDescription,
                -textWidth / 2,
                0,
                textWidth,
                "center"
            )
            fillTextShrinkToFit(
                context,
                offer.valueDescription,
                -textWidth / 2,
                0,
                textWidth,
                "center"
            )
            context.rotate(-textAngle);
            context.translate(-starX, -starY);

            var boxFrameWidth = 5;
            var listBoxX = coords.x;
            var listBoxY = imageBox.y + imageBox.height + padding;
            var listBoxWidth = this.boundingBox.width;
            var listBoxHeight = this.boundingBox.height - (listBoxY - coords.y) - padding;

            var listPadding = (listBoxHeight - 2 * boxFrameWidth) * 0.03;
            var listX = boxFrameWidth + listBoxX;
            var listY = boxFrameWidth + listBoxY;
            var maxItemsInList = 6;
            var itemWidth = (listBoxWidth - 2 * boxFrameWidth) / maxItemsInList;
            var itemHeight = listBoxHeight - 2 * boxFrameWidth;
            var itemImageHeight = itemHeight * 0.8;

            root.drawBox(
                listBoxX,
                listBoxY,
                listBoxWidth,
                listBoxHeight,
                boxFrameWidth,
                0.25
            );

            var rewardIds = Object.keys(offer.rewards);
            for (var i in rewardIds)
            {
                var itemCoords = getItemCoordsInList(
                    itemWidth,
                    itemHeight,
                    listPadding,
                    listPadding,
                    maxItemsInList,
                    parseInt(i)
                );
                
                context.globalAlpha = 0.25;
                renderRoundedRectangle(
                    context, 
                    listX + itemCoords.x,
                    listY + itemCoords.y,
                    itemWidth,
                    itemHeight,
                    3, 
                    "#000000", 
                    "#000000", 
                    0
                );
                context.globalAlpha = 1;

                drawImageFitInBox(
                    context,
                    offerManager.getRewardImage(rewardIds[i]),
                    listX + itemCoords.x,
                    listY + itemCoords.y,
                    itemWidth,
                    itemHeight,
                    "center",
                    "center"
                );

                context.fillStyle = "#FFFFFF";
                context.strokeStyle = "#000000";
                context.lineWidth = 2;
                context.textBaseline = "bottom";
                context.font = itemHeight * 0.2 + "px KanitB";
                outlineTextWrap(
                    context,
                    "x" + offer.rewards[rewardIds[i]],
                    listX + itemCoords.x,
                    listY + itemCoords.y + itemHeight,
                    itemWidth,
                    "right"
                );
            }
            
            context.restore();
        }
    }

    createFooter()
    {
        var fontSize = Math.min(32, this.boundingBox.height * 0.080);
        this.buyButton = this.bodyContainer.addHitbox(
            new Button(
                startb, "", fontSize + "px KanitB", "#000000",
                {
                    x: this.bodyContainer.boundingBox.width * 0.05,
                    y: this.bodyContainer.boundingBox.height * 0.87,
                    width: this.bodyContainer.boundingBox.width * 0.9,
                    height: this.bodyContainer.boundingBox.height * 0.12
                }, 
                {
                    onmousedown: function()
                    {
                        offerManager.purchaseOffer();
                        closeUi(this);
                    }.bind(this)
                }
            )
        )
        this.buyButton.render = function()
        {
            var root = this.getRootLayer();
            var offer = root.getOffer();
            var coords = this.getRelativeCoordinates(0, 0, root);
            var context = root.context;
            var price = offerManager.getOfferPrice();

            context.font = (this.boundingBox.height * 0.8) + "px KanitM";
            context.fillStyle = "#FFFFFF";
            context.textBaseline = "middle";
            context.lineWidth = this.boundingBox.height * 0.08;
            drawNineSlice(
                context,
                startb,
                coords.x,
                coords.y,
                this.boundingBox.width,
                this.boundingBox.height,
                31,
                24
            );
            strokeTextShrinkToFit(
                context,
                price,
                coords.x + (this.boundingBox.width * 0.075),
                coords.y + (this.boundingBox.height * 0.51),
                this.boundingBox.width * .85,
                "center"
            );
            fillTextShrinkToFit(
                context,
                price,
                coords.x + (this.boundingBox.width * 0.075),
                coords.y + (this.boundingBox.height * 0.51),
                this.boundingBox.width * .85,
                "center"
            );
        }
    }

    getOffer()
    {
        return offerManager.getCurrentOffer();
    }

    render()
    {
        if (!isDivVisible(this.domElementId))
        {
            showDiv(this.domElementId, this.zIndex);
        }
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        drawColoredRect(this.context, 0, 0, this.boundingBox.width, this.boundingBox.height, "#000000", 0.5);

        this.renderChildren();
    }

    drawBox(x, y, width, height, frameWidth, backgroundOpacity, backgroundColor="#000000")
    {
        this.context.save();
        this.context.fillStyle = backgroundColor;
        this.context.globalAlpha = backgroundOpacity;
        this.context.fillRect(x, y, width, height);
        this.context.globalAlpha = 1;
        drawFrame(
            this.context,
            itemFrame,
            x,
            y,
            width,
            height,
            frameWidth,
            4,
            0,
            0
        );
        this.context.restore();
    }

    drawStar(context, cx,cy,spikes,outerRadius,innerRadius){
        var rot=Math.PI/2*3;
        var x=cx;
        var y=cy;
        var step=Math.PI/spikes;
  
        context.beginPath();
        context.moveTo(cx,cy-outerRadius)
        for(i=0;i<spikes;i++){
          x=cx+Math.cos(rot)*outerRadius;
          y=cy+Math.sin(rot)*outerRadius;
          context.lineTo(x,y)
          rot+=step
  
          x=cx+Math.cos(rot)*innerRadius;
          y=cy+Math.sin(rot)*innerRadius;
          context.lineTo(x,y)
          rot+=step
        }
        context.lineTo(cx,cy-outerRadius);
        context.closePath();
        context.stroke();
        context.fill();
      }
}