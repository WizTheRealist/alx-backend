#!/usr/bin/env python3
"""Hypermedia pagination"""
import csv
from typing import Dict, List, Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """
    Write a function named index_range that takes two integer arguments
    page and page_size.

    The function should return a tuple of size two containing a start
    index and an end index corresponding to the range of indexes to return
    in a list for those particular pagination parameters.

    Page numbers are 1-indexed, i.e. the first page is page 1.

    Returns:
        int: a tuple of the index ranges
    """
    return ((page-1)*page_size, page_size*page)


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self) -> None:
        self.__dataset = None

    def dataset(self) -> List[List]:
        """opens the file and stores the data in a variable

        Returns:
            List[List]: carries the list of data
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """
        Implement a method named get_page that takes two integer
        arguments page with default value 1 and page_size with
        default value 10.
        """
        assert page > 0 and page_size > 0
        assert type(page) == int and type(page_size) == int
        start, end = index_range(page, page_size)
        data = self.dataset()
        return [] if start > len(data) else data[start:end]

    def get_hyper(self, page: int = 1, page_size: int = 10) -> Dict:
        """returns information about a page and the data

        Args:
            page (int, optional): _description_. Defaults to 1.
            page_size (int, optional): _description_. Defaults to 10.

        Returns:
            _type_: _description_
        """

        from math import ceil

        data = self.get_page(page, page_size)

        return {
            "page_size": len(data),
            "page": page,
            "data": data,
            "next_page": None if (page+1) >= len(self.__dataset)/page_size
            else page + 1,
            "prev_page": None if page == 1 else page - 1,
            "total_pages": ceil(len(self.__dataset) / page_size)
        }
    