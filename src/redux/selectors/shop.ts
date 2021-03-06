import { createSelector } from 'reselect';
import memoize from 'lodash.memoize';

import { IGlobalState, ICollection } from '../../interfaces';

const selectShop = (state: IGlobalState) => state.shop;

export const selectCollections = createSelector(
  [selectShop],
  (shop) => shop.collections
);

export const selectCollectionsForPreview = createSelector(
  [selectCollections],
  (collections) =>
    collections
      ? Object.keys(collections).map((key: any) => collections[key])
      : []
);

export const selectCollection = memoize((collectionUrlParam: any) =>
  createSelector([selectCollections], (collections) =>
    collections ? collections[collectionUrlParam] : null
  )
);

export const selectIsCollectionFetching = createSelector(
  [selectShop],
  (shop) => shop.isFetching
);

export const selectCollectionsLoaded = createSelector(
  [selectShop],
  (shop) => !!shop.collections
);
