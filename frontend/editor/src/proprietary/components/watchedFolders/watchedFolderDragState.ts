let draggedFileIds: string[] = [];

export const setWatchedFolderDraggedFileIds = (fileIds: string[]): void => {
  draggedFileIds = fileIds;
};

export const clearWatchedFolderDraggedFileIds = (): void => {
  draggedFileIds = [];
};

export const getWatchedFolderDraggedFileIds = (): string[] => draggedFileIds;
