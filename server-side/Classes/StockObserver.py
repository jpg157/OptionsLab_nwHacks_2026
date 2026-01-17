class StockObserver:
    def __init__(self, stockSymbol):
        # Constructor: runs when you create a new object
        self.stockSymbol = stockSymbol  # instance variable
        self.strikePrices = {}  # { strikePrice: [subscribers] }
    
    def add_subscriber(self, strikePrice, subscriber):
        # If strikePrice not yet in dictionary, initialize with empty list
        if strikePrice not in self.strikePrices:
            self.strikePrices[strikePrice] = []

        # Add subscriber to the list for this strike price
        self.strikePrices[strikePrice].append(subscriber)

    def get_strikePrice_keys(self):
        # Return a list of all strike prices
        return list(self.strikePrices.keys())

    def get_subscribers(self, strikePrice):
        # Return list of subscribers for a strike price (empty list if none)
        return self.strikePrices.get(strikePrice, [])

    def __repr__(self):
        return f"<StockObserver {self.stockSymbol}: {self.strikePrices}>"
