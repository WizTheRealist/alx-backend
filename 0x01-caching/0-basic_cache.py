#!/usr/bin/env python3
"""Basic dictionary"""
from base_caching import BaseCaching
from typing import Any


class BasicCache(BaseCaching):
    """_summary_

    Args:
        BaseCaching (BaseCaching): base caching service
    """

    def put(self, key: Any, item: Any) -> None:
        """adds an item to the caching service with it key

        Args:
            key (Any): key of the item
            item (Any): the item
        """
        if not key or not item:
            return
        self.cache_data[key] = item

    def get(self, key: Any) -> Any:
        """Retrieves the data stored in the cache

        Args:
            key (Any): the key used to retrieve the data

        Returns:
            Any: _description_
        """
        return self.cache_data.get(key, None)
