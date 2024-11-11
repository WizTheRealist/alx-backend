#!/usr/bin/env python3
"""LIFO Caching"""
from base_caching import BaseCaching
from typing import Any
from collections import OrderedDict


class LIFOCache(BaseCaching):
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
        self.cache_data.update({key: item})
        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            print("DISCARD:", self.cache_data.popitem(False)[0])
        self.cache_data.move_to_end(key, last=False)

    def get(self, key: Any) -> Any:
        """Retrieves the data stored in the cache

        Args:
            key (Any): the key used to retrieve the data

        Returns:
            Any: _description_
        """
        return self.cache_data.get(key, None)
