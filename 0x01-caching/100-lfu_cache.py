#!/usr/bin/env python3
""" LFU Caching"""
from base_caching import BaseCaching
from typing import Any
from collections import deque


class LFUCache(BaseCaching):
    """_summary_

    Args:
        BaseCaching (BaseCaching): base caching service
    """

    def __init__(self) -> None:
        """initializes the class"""
        self.index = deque(maxlen=BaseCaching.MAX_ITEMS)
        self.counter = {}
        super().__init__()

    def put(self, key: Any, item: Any) -> None:
        """adds an item to the caching service with it key

        Args:
            key (Any): key of the item
            item (Any): the item
        """
        if not key or not item:
            return

        if key in self.cache_data:
            self.index.remove(key)
            self.counter = {key: 0 for key in self.counter.keys()}

        elif len(self.counter) < BaseCaching.MAX_ITEMS:
            pass

        else:
            # removes the first object in the cache
            discard_value = sorted(self.counter.values())[0]
            discard_key = None
            for discard_key in self.index:
                if self.counter[discard_key] == discard_value:
                    break
            self.cache_data.pop(discard_key)
            self.counter.pop(discard_key)
            self.index.remove(discard_key)
            print("DISCARD:", str(discard_key))

        self.index.append(key)
        self.counter[key] = 0
        self.cache_data[key] = item

    def get(self, key: Any) -> Any:
        """Retrieves the data stored in the cache

        Args:
            key (Any): the key used to retrieve the data

        Returns:
            Any: _description_
        """
        if key in self.cache_data:
            self.counter[key] += 1
            return self.cache_data.get(key)
