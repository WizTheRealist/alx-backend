#!/usr/bin/env python3
"""MRU Caching"""
from base_caching import BaseCaching
from typing import Any
from collections import OrderedDict


class MRUCache(BaseCaching):
    """_summary_

    Args:
        BaseCaching (BaseCaching): base caching service
    """

    def __init__(self) -> None:
        """initializes the class"""
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key: Any, item: Any) -> None:
        """adds an item to the caching service with it key

        Args:
            key (Any): key of the item
            item (Any): the item
        """
        if not key or not item:
            return

        if key in self.cache_data:
            self.cache_data[key] = item
            return
        if len(self.cache_data)+1 > BaseCaching.MAX_ITEMS:
            # returns k,v in FIFO order
            print("DISCARD:", self.cache_data.popitem(False)[0])
        self.cache_data[key] = item
        self.cache_data.move_to_end(key, last=False)

    def get(self, key: Any) -> Any:
        """Retrieves the data stored in the cache

        Args:
            key (Any): the key used to retrieve the data

        Returns:
            Any: _description_
        """
        if key and key in self.cache_data:
            # returns k,v in FIFO order
            self.cache_data.move_to_end(key, last=False)
            return self.cache_data.get(key)
