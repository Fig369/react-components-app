import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for managing multiple item selection
 * Handles selection state, toggle, select all, and clear operations
 * 
 * @param {Array} items - Array of items that can be selected
 * @param {string|Function} getItemId - Key name or function to get item ID
 * @param {Array} initialSelected - Initially selected item IDs
 * @returns {Object} Selection state and controls
 */
export const useMultiSelect = (items = [], getItemId = 'id', initialSelected = []) => {
  const [selectedItems, setSelectedItems] = useState(initialSelected);

  // Helper function to get item ID
  const getIdFromItem = useCallback((item) => {
    return typeof getItemId === 'function' ? getItemId(item) : item[getItemId];
  }, [getItemId]);

  // Get all available item IDs
  const allItemIds = useMemo(() => {
    return items.map(getIdFromItem);
  }, [items, getIdFromItem]);

  // Toggle single item selection
  const toggleItem = useCallback((itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  // Select all items
  const selectAll = useCallback(() => {
    setSelectedItems(allItemIds);
  }, [allItemIds]);

  // Clear all selections
  const clearAll = useCallback(() => {
    setSelectedItems([]);
  }, []);

  // Select specific items by IDs
  const selectItems = useCallback((itemIds) => {
    const validIds = itemIds.filter(id => allItemIds.includes(id));
    setSelectedItems(validIds);
  }, [allItemIds]);

  // Add items to selection (without removing existing)
  const addItems = useCallback((itemIds) => {
    const validIds = itemIds.filter(id => 
      allItemIds.includes(id) && !selectedItems.includes(id)
    );
    setSelectedItems(prev => [...prev, ...validIds]);
  }, [allItemIds, selectedItems]);

  // Remove items from selection
  const removeItems = useCallback((itemIds) => {
    setSelectedItems(prev => prev.filter(id => !itemIds.includes(id)));
  }, []);

  // Check if item is selected
  const isSelected = useCallback((itemId) => {
    return selectedItems.includes(itemId);
  }, [selectedItems]);

  // Check if all items are selected
  const isAllSelected = useMemo(() => {
    return allItemIds.length > 0 && allItemIds.every(id => selectedItems.includes(id));
  }, [allItemIds, selectedItems]);

  // Check if some items are selected (for indeterminate state)
  const isSomeSelected = useMemo(() => {
    return selectedItems.length > 0 && selectedItems.length < allItemIds.length;
  }, [selectedItems, allItemIds]);

  // Get selected items data (not just IDs)
  const selectedItemsData = useMemo(() => {
    return items.filter(item => selectedItems.includes(getIdFromItem(item)));
  }, [items, selectedItems, getIdFromItem]);

  // Get unselected items data
  const unselectedItemsData = useMemo(() => {
    return items.filter(item => !selectedItems.includes(getIdFromItem(item)));
  }, [items, selectedItems, getIdFromItem]);

  // Selection statistics
  const selectionStats = useMemo(() => ({
    total: allItemIds.length,
    selected: selectedItems.length,
    unselected: allItemIds.length - selectedItems.length,
    percentage: allItemIds.length > 0 ? (selectedItems.length / allItemIds.length) * 100 : 0
  }), [allItemIds, selectedItems]);

  return {
    // State
    selectedItems,
    selectedItemsData,
    unselectedItemsData,
    selectionStats,
    
    // Status checks
    isSelected,
    isAllSelected,
    isSomeSelected,
    
    // Actions
    toggleItem,
    selectAll,
    clearAll,
    selectItems,
    addItems,
    removeItems,
    
    // Direct state setter for advanced use cases
    setSelectedItems
  };
};

export default useMultiSelect;