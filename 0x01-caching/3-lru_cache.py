#!/usr/bin/env python3
""" LRU Caching"""
from base_caching import BaseCaching
from typing import Any
from queue import Queue


class LRUCache(BaseCaching):
    """_summary_

    Args:
        BaseCaching (BaseCaching): base caching service
    """

    def __init__(self) -> None:
        """initializes the class"""
        self.index = Queue(BaseCaching.MAX_ITEMS)
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
            self.index.queue.remove(key)

        elif not self.index.full():
            pass
        else:
            # removes the first object in the cache
            discard_key = self.index.get()
            self.cache_data.pop(discard_key)
            print("DISCARD:", str(discard_key))

        self.index.put(key)
        self.cache_data[key] = item

    def get(self, key: Any) -> Any:
        """Retrieves the data stored in the cache

        Args:
            key (Any): the key used to retrieve the data

        Returns:
            Any: _description_
        """
        if key in self.cache_data:
            self.index.queue.remove(key)
            self.index.queue.append(key)
            return self.cache_data.get(key)
