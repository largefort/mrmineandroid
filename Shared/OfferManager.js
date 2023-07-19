class OfferManager
{
    isEnabled = false;

    currentOffer = null;

    lastRequestTime = 0;
    lastOfferTime = 0;
    offerHistory = [];

    storedChests = {};

    hasSeenOffer = false;

    logDebugMessages = true;
    requireStore = true;

    availableRewards = {
        tickets: {
            image: ticketicon,
            name: _("Tickets"),
            onPurchase: function(quantity)
            {
                tickets += quantity;
            }
        },
        basicChest: {
            image: basicChestIconClosed,
            name: _("Basic Chest"),
            onPurchase: function(quantity)
            {
                offerManager.storeChests(ChestType.basic, quantity);
            }
        },
        goldChest: {
            image: goldChestIconClosed,
            name: _("Gold Chest"),
            onPurchase: function(quantity)
            {
                offerManager.storeChests(ChestType.gold, quantity);
            }
        },
        blackChest: {
            image: blackChestIconClosed,
            name: _("Black Chest"),
            onPurchase: function(quantity)
            {
                offerManager.storeChests(ChestType.black, quantity);
            }
        },
    };

    offerSaveDataMap = {
        id: {index: 0},
        sku: {index: 1},
        name: {index: 2},
        image: {index: 3, loadFunction: (src) => {var img = new Image(); img.src = src; return img;}, saveFunction: (img) => img.src},
        price: {index: 4, loadFunction: parseInt},
        valueDescription: {index: 5},
        rewards: {index: 6, loadFunction: (x) => JSON.parse(atob(x)), saveFunction: (x) => btoa(JSON.stringify(x))},
        duration: {index: 7, loadFunction: parseInt},
        startTime: {index: 8, loadFunction: parseInt}
    };

    offerEndpoint = "https://mrmine.com/offers/requestoffer.php";

    constructor()
    {
        this.init();
    }

    init()
    {
        if (!this.isEnabled)
        {
            return false;
        }
        this.currentOffer = null;

        this.lastRequestTime = 0;
        this.lastOfferTime = 0;
        this.offerHistory = [];
    
        this.storedChests = {
            [ChestType.basic]: 0,
            [ChestType.gold]: 0,
            [ChestType.black]: 0
        };
        return true;
    }

    update()
    {
        if (!this.isEnabled)
        {
            return false;
        }
        if (this.isOfferExpired())
        {
            this.clearOffer();
        }
        if (this.isReadyForOffer())
        {
            this.requestOffer();
        }
        return true;
    }

    requestOffer()
    {
        if (!this.isEnabled || (this.requireStore && !this.isStoreReady()))
        {
            return false;
        }
        this.lastRequestTime = Math.floor(new Date().getTime() / 1000);
        this.offer = null;
        ajax(
            this.offerEndpoint,
            {
                gameId: "mrmine",
                uid: UID,
                lastOfferTime: this.lastOfferTime,
                offerHistory: JSON.stringify(this.offerHistory),
                platform: platformName(),
                gameStateInfo: JSON.stringify({
                    depth: depth,
                    money: money.toString()
                })
            },
            "GET",
            function(responseJson)
            {
                var response = JSON.parse(responseJson);
                if (this.logDebugMessages)
                {
                    console.log(response);
                }
                if(response.code == 200)
                {
                    if (response.data.offer)
                    {
                        this.updateOffer(response.data.offer);
                    }
                }
            }.bind(this)
        );
        return true;
    }

    updateOffer(newOffer)
    {
        if (!this.isEnabled)
        {
            return false;
        }
        this.currentOffer = newOffer;
        this.currentOffer.image = new Image();
        this.currentOffer.image.src = newOffer.imageUrl;
        this.lastOfferTime = Math.floor(new Date().getTime() / 1000);
        this.offerHistory.push(newOffer.id);
        platform.registerSinglePurchasePack(newOffer.sku);
        store.update();
        return true;
    }

    purchaseOffer()
    {
        if (!this.isEnabled)
        {
            return false;
        }
        if (this.requireStore)
        {
            return platform.buyPack(this.currentOffer.sku);
        }
        else
        {
            return this.completePurchase();
        }
    }

    grantRewards()
    {
        if (!this.isEnabled)
        {
            return false;
        }
        for (var i in this.currentOffer.rewards)
        {
            this.availableRewards[i].onPurchase(this.currentOffer.rewards[i])
        }
        return true;
    }

    completePurchase()
    {
        if (!this.isEnabled)
        {
            return false;
        }
        this.grantRewards();
        this.currentOffer = null;
        return true;
    }

    clearOffer()
    {
        this.currentOffer = null;
    }

    isReadyForOffer()
    {
        if (!this.isEnabled)
        {
            return false;
        }
        return !this.currentOffer;
    }

    isOfferExpired()
    {
        if (!this.isEnabled)
        {
            return false;
        }
        if (this.currentOffer)
        {
            return this.getTimeRemainingForOffer() <= 0;
        }
        return false;
    }

    getOfferPrice()
    {
        if (this.isEnabled && this.requireStore && this.isStoreReady())
        {
            return platform.getPackPrice(this.currentOffer.sku);
        }
        else if (!this.requireStore)
        {
            return "$0.00";
        }
    }

    getTimeRemainingForOffer()
    {
        if (this.isEnabled && this.currentOffer)
        {
            var now = Math.floor(Date.now() / 1000);
            return this.currentOffer.startTime + this.currentOffer.duration - now;
        }
        return 0;
    }

    storeChests(chestType, quantity)
    {
        if (this.isEnabled && typeof(this.storedChests[chestType]) != "undefined")
        {
            this.storedChests[chestType] += quantity;
            return true;
        }
        return false;
    }

    grantStoredChest(chestType)
    {
        if (this.isEnabled && this.storedChests[chestType] && this.storedChests[chestType] > 0)
        {
            if (chestService.spawnChest(0, Chest.metaldetector, chestType))
            {
                chestService.presentChest(0);
                this.storedChests[chestType]--;
                return true;
            }
        }
        return false;
    }

    getStoredChestsOfType(chestType)
    {
        if (this.isEnabled && typeof(this.storedChests[chestType]) != "undefined")
        {
            return this.storedChests[chestType];
        }
        return -1;
    }

    hasUnclaimedChests()
    {
        if (!this.isEnabled)
        {
            return false;
        }
        for (var i in this.storedChests)
        {
            if (this.storedChests[i] > 0)
            {
                return true;
            }
        }
        return false;
    }

    getCurrentOffer()
    {
        if (!this.isEnabled)
        {
            return null;
        }
        if (!this.requireStore || this.isStoreReady())
        {
            return this.currentOffer;
        }
        return null;
    }

    getRewardName(rewardId)
    {
        if (this.availableRewards[rewardId])
        {
            return this.availableRewards[rewardId].name;
        }
        console.error("Attempting to access invalid reward '%s'", rewardId);
        return "ERROR";
    }

    getRewardImage(rewardId)
    {
        if (this.availableRewards[rewardId])
        {
            return this.availableRewards[rewardId].image;
        }
        console.error("Attempting to access invalid reward '%s'", rewardId);
        return closei;
    }

    getRewardPurchaseFunction(rewardId)
    {
        if (this.availableRewards[rewardId])
        {
            return this.availableRewards[rewardId].onPurchase;
        }
        console.error("Attempting to access invalid reward '%s'", rewardId);
        return function() {};
    }

    isStoreReady()
    {
        return typeof(store) != "undefined"
    }

    get saveState()
    {
        var offerSaveArray = [];
        if (this.currentOffer)
        {
            for(var key in this.offerSaveDataMap)
            {
                if (this.offerSaveDataMap[key].saveFunction)
                {
                    offerSaveArray[this.offerSaveDataMap[key].index] = this.offerSaveDataMap[key].saveFunction(this.currentOffer[key]);
                }
                else
                {
                    offerSaveArray[this.offerSaveDataMap[key].index] = this.currentOffer[key];
                }
            }
        }
        var storedChestsString = btoa(JSON.stringify(this.storedChests));
        var saveArray = [
            this.lastOfferTime,
            this.offerHistory.join(".!"),
            offerSaveArray.join(".!"),
            storedChestsString
        ];
        return saveArray.join(".*.");
    }

    set saveState(value)
    {
        var valueArray = value.split(".*.");
        this.lastOfferTime = valueArray[0];
        var offerHistory = valueArray[1].split(".!");
        if (offerHistory.length == 1 && offerHistory[0] == "")
        {
            this.offerHistory = [];
        }
        else
        {
            this.offerHistory = offerHistory;
        }
        var offerArray = valueArray[2].split(".!");
        if (offerArray.length == 1 && offerArray[0] == "")
        {
            this.offerArray = null;
        }
        else
        {
            this.currentOffer = {};
            for(var key in this.offerSaveDataMap)
            {
                this.currentOffer[key] = offerArray[this.offerSaveDataMap[key].index];
                if(this.offerSaveDataMap[key].loadFunction)
                {
                    this.currentOffer[key] = this.offerSaveDataMap[key].loadFunction(this.currentOffer[key]);
                }
            }
        }
        this.storedChests = JSON.parse(atob(valueArray[3]));
    }
}

var offerManager = new OfferManager();