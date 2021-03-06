import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useCallbackRef } from 'use-callback-ref';

import {
  fetchAllBookmarklets,
  executeBookmarklet
} from '../../store/actions/bookmarklets';
import { openEditorWindow } from '../../store/actions/ui';
import { createNewBookmarklet } from '../../store/actions/editor';

import SearchField from '../../components/search_field';
import SearchList from '../../components/search_list';
import ScrollView from '../../components/scroll_view';
import OnboardMessage from '../../components/onboard_message';
import ItemActions from '../../components/item_actions';
import Toolbar from '../../components/toolbar';
import Icon from '../../components/icon';
import Button from '../../components/button';

import './home_screen.css';

const HIDE_EDITOR = true;
const KEYS = {
  ENTER: 13,
  UP: 38,
  DOWN: 40,
  RIGHT: 39,
  LEFT: 37
};

export default function HomeScreen() {
  const bookmarklets = useSelector((state) => state.bookmarklets.all);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollViewY, setScrollViewY] = useState(0);
  const [currentScrollViewY, setCurrentScrollViewY] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [currentItem, setCurrentItem] = useState();

  const selectedItemTop = selectedIndex * 40;
  const selectedItemBottom = selectedIndex * 40 + 40;

  // https://dev.to/thekashey/the-same-useref-but-it-will-callback-8bo
  const searchInputRef = useCallbackRef(null, (ref) => {
    ref && ref.focus();
  });

  useEffect(() => {
    dispatch(fetchAllBookmarklets());
  }, []);

  useEffect(() => {
    if (selectedIndex >= 0 && selectedItemTop < currentScrollViewY) {
      setScrollViewY(selectedItemTop);
    }

    if (
      selectedIndex <= totalItems - 1 &&
      selectedItemBottom > currentScrollViewY + 400
    ) {
      setScrollViewY(selectedItemBottom - 400);
    }
  }, [selectedIndex, totalItems]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const execute = (url) => {
    dispatch(executeBookmarklet(url));
    window.close();
  };

  const getPrevIndex = () => {
    const calculatedIndex = selectedIndex - 1;
    return calculatedIndex < 0 ? totalItems - 1 : calculatedIndex;
  };

  const getNextIndex = () => {
    const calculatedIndex = selectedIndex + 1;
    return calculatedIndex > totalItems - 1 ? 0 : calculatedIndex;
  };

  const handleSpecialKey = (evt) => {
    switch (evt.keyCode) {
      case KEYS.ENTER:
        if (currentItem.url) {
          execute(currentItem.url);
        }

        break;
      case KEYS.UP:
        setSelectedIndex(getPrevIndex());
        break;

      case KEYS.DOWN:
        setSelectedIndex(getNextIndex());
        break;

      default:
    }
  };

  const handleInputChange = (evt) => {
    if (evt.keyCode) {
      switch (evt.keyCode) {
        case KEYS.LEFT:
        case KEYS.RIGHT:
          return;

        case KEYS.ENTER:
        case KEYS.UP:
        case KEYS.DOWN:
          evt.preventDefault();
          handleSpecialKey(evt);
          return;
        default:
      }
    }

    setSearchQuery(searchInputRef.current.value);
  };

  const handleBookmarkletClick = (url) => {
    execute(url);
  };

  const handleItemSelect = (item, total) => {
    setCurrentItem(item);
    setTotalItems(total);
  };

  const handleOnScroll = (x, y) => {
    setCurrentScrollViewY(y);
  };

  const handleOnEditClick = async (id) => {
    await dispatch(openEditorWindow(id));
    window.close();
  };

  const handleOnNewClick = () => {
    dispatch(createNewBookmarklet());
    window.close();
  };

  return (
    <div className="home-screen">
      <SearchField
        ref={searchInputRef}
        onKeyDown={handleInputChange}
        onChange={handleInputChange}
        placeholder="Search scripts"
      />

      {bookmarklets.length !== 0 && (
        <ScrollView y={scrollViewY} onScroll={handleOnScroll}>
          <SearchList
            query={searchQuery}
            items={bookmarklets}
            selected={selectedIndex}
            onChange={handleItemSelect}
            onItemClick={handleBookmarkletClick}
            onItemSelect={handleItemSelect}
            renderItemActions={(item, isSelected, isMouseOver) => {
              if (!HIDE_EDITOR && (isSelected || isMouseOver)) {
                return (
                  <ItemActions
                    onEditClick={handleOnEditClick.bind(null, item.id)}
                  />
                );
              }
            }}
          />
        </ScrollView>
      )}

      {bookmarklets.length === 0 && <OnboardMessage />}

      {!HIDE_EDITOR && bookmarklets.length !== 0 && (
        <Toolbar>
          <Button
            type="toolbar"
            icon={<Icon name="plus" />}
            onClick={handleOnNewClick}
          >
            Create new script
          </Button>
        </Toolbar>
      )}
    </div>
  );
}
