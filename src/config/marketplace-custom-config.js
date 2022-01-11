/*
 * Marketplace specific configuration.
 */

/**
 * Active processes.
 * Note: these should match with the process names in src/util/transaction.js
 */
export const processes = ['flex-product-default-process', 'flex-default-process'];

/**
 * Configuration options for extended data fields:
 * - key:                           Unique key for the extended data field.
 * - scope (optional):              Scope of the extended data can be either 'public' or 'private'.
 *                                  Default value: 'public'.
 *                                  Note: listing doesn't support 'protected' scope atm.
 * - includeForProcessAliases:      An array of transaction process aliases, for which the extended
 *                                  data is relevant and should be added.
 * - schemaType (optional):         Schema for this extended data field.
 *                                  This is relevant when rendering components and querying listings.
 *                                  Possible values: 'enum', 'multi-enum', 'text', 'long', 'boolean'.
 * - schemaOptions (optional):      Options shown for 'enum' and 'multi-enum' extended data.
 *                                  These are used to render options for inputs and filters on
 *                                  EditListingPage, ListingPage, and SearchPage.
 * - indexForSearch (optional):     If set as true, it is assumed that the extended data key has
 *                                  search index in place. I.e. the key can be used to filter
 *                                  listing queries (then scope needs to be 'public').
 *                                  Note: Flex CLI can be used to set search index for the key:
 *                                  https://www.sharetribe.com/docs/references/extended-data/#search-schema
 *                                  Read more about filtering listings with public data keys from API Reference:
 *                                  https://www.sharetribe.com/api-reference/marketplace.html#extended-data-filtering
 * - searchPageConfig:              Search-specific configuration.
 *   - label:                         Label for the filter, if the field can be used as query filter
 *   - searchMode (optional):         Search mode for indexed data with multi-enum schema.
 *                                    Possible values: has_all' or 'has_any'.
 * - listingPageConfig:             Configuration for rendering listing.
 *   - label:                         Label for the saved data.
 * - editListingPageConfig:         Configuration for adding and modifying extended data fields.
 *   - label:                         Label for the input field.
 *   - placeholderMessage (optional): Default message for user input.
 *   - requiredMessage (optional):    Message for those fields, which are mandatory.
 */
export const listingExtendedData = [
  {
    key: 'category',
    scope: 'public',
    includeForProcessAliases: ['flex-product-default-process/release-1'],
    schemaType: 'enum',
    schemaOptions: ['Men', 'Women', 'Kids'],
    indexForSearch: true,
    searchPageConfig: {
      label: 'Category',
    },
    listingPageConfig: {
      label: 'Category',
    },
    editListingPageConfig: {
      label: 'Select category',
      placeholder: 'Choose…',
      requiredMessage: 'You need to select a category.',
    },
  },

  {
    key: 'size',
    scope: 'public',
    includeForProcessAliases: ['flex-product-default-process/release-1'],
    schemaType: 'enum',
    schemaOptions: [4, 5, 6, 7, 8, 9, 10, 11, 12],
    indexForSearch: true,
    searchPageConfig: {
      label: 'Size (US)',
    },
    listingPageConfig: {
      label: 'Size (US)',
    },
    editListingPageConfig: {
      label: 'Select size (US)',
      placeholder: 'Choose…',
      requiredMessage: 'You need to select a size.',
    },
  },
  {
    key: 'brand',
    scope: 'public',
    includeForProcessAliases: ['flex-product-default-process/release-1'],
    schemaType: 'enum',
    schemaOptions: [
      'Adidas',
      'Air Jordan',
      'Converse',
      'New Balance',
      'Nike',
      'Puma',
      'Ultraboost',
      'Vans',
      'Yeezy',
      'Other',
    ],
    indexForSearch: true,
    searchPageConfig: {
      label: 'Brand',
    },
    listingPageConfig: {
      label: 'Brand',
    },
    editListingPageConfig: {
      label: 'Select brand',
      placeholder: 'Choose…',
      requiredMessage: 'You need to select a brand.',
    },
  },
  {
    key: 'category_sauna',
    scope: 'public',
    includeForProcessAliases: ['flex-default-process/release-1'],
    schemaType: 'enum',
    schemaOptions: ['Smoky', 'Electric', 'Wood', 'Other'],
    indexForSearch: true,
    searchPageConfig: {
      label: 'Category',
    },
    listingPageConfig: {
      label: 'Category',
    },
    editListingPageConfig: {
      label: 'Select category',
      placeholder: 'Choose…',
      requiredMessage: 'You need to select what type of sauna you have.',
    },
  },
  {
    key: 'amenities',
    scope: 'public',
    includeForProcessAliases: ['flex-default-process/release-1'],
    schemaType: 'multi-enum',
    schemaOptions: ['Towels', 'Bathroom', 'Swimming pool', 'Barbeque'],
    indexForSearch: true,
    searchPageConfig: {
      label: 'Amenities',
      searchMode: 'has_all',
    },
    listingPageConfig: {
      label: 'Amenities',
    },
    editListingPageConfig: {
      label: 'Select all the amenities you provide',
    },
  },

  {
    key: 'blaa',
    scope: 'public',
    includeForProcessAliases: ['flex-product-default-process/release-1'],
    schemaType: 'text',
    indexForSearch: true,
    searchPageConfig: {
      label: 'Blaa',
    },
    listingPageConfig: {
      label: 'Blaa',
    },
    editListingPageConfig: {
      label: 'Blaa',
      placeholder: 'Blaa bla blaa',
      requiredMessage: 'You need to write something.',
    },
  },
  {
    key: 'note',
    scope: 'private',
    includeForProcessAliases: ['flex-default-process/release-1'],
    schemaType: 'text',
    indexForSearch: false,
    editListingPageConfig: {
      label: 'Private notes',
      placeholder: 'Blaa bla blaa',
    },
  },
  {
    key: 'gears',
    scope: 'public',
    includeForProcessAliases: ['flex-product-default-process/release-1'],
    schemaType: 'long',
    indexForSearch: true,
    searchPageConfig: {
      label: 'Gears',
    },
    listingPageConfig: {
      label: 'Gears',
    },
    editListingPageConfig: {
      label: 'Gears',
      placeholder: 'The number of gears',
      requiredMessage: 'You need to add details about gears.',
    },
  },
  {
    key: 'has_lights',
    scope: 'public',
    includeForProcessAliases: ['flex-product-default-process/release-1'],
    schemaType: 'boolean',
    indexForSearch: true,
    searchPageConfig: {
      label: 'Has lights',
    },
    listingPageConfig: {
      label: 'Has lights',
    },
    editListingPageConfig: {
      label: 'Has lights',
      placeholder: 'Choose yes/no',
      //requiredMessage: 'You need to tell if the bike has lights.',
    },
  },
];

/**
 * Every filter needs to have following keys:
 * - id:     Unique id of the filter.
 * - label:  The default label of the filter.
 * - type:   String that represents one of the existing filter components:
 *           BookingDateRangeFilter, KeywordFilter, PriceFilter,
 *           SelectSingleFilter, SelectMultipleFilter.
 * - group:  Is this 'primary' or 'secondary' filter?
 *           Primary filters are visible on desktop layout by default.
 *           Secondary filters are behind "More filters" button.
 *           Read more from src/containers/SearchPage/README.md
 * - queryParamNames: Describes parameters to be used with queries
 *                    (e.g. 'price' or 'pub_amenities'). Most of these are
 *                    the same between webapp URLs and API query params.
 *                    You can't change 'dates', 'price', or 'keywords'
 *                    since those filters are fixed to a specific attribute.
 * - config: Extra configuration that the filter component needs.
 *
 * Note 1: Labels could be tied to translation file
 *         by importing FormattedMessage:
 *         <FormattedMessage id="some.translation.key.here" />
 *
 * Note 2: If you need to add new custom filter components,
 *         you need to take those into use in:
 *         src/containers/SearchPage/FilterComponent.js
 *
 * Note 3: If you just want to create more enum filters
 *         (i.e. SelectSingleFilter, SelectMultipleFilter),
 *         you can just add more configurations with those filter types
 *         and tie them with correct extended data key
 *         (i.e. pub_<key> or meta_<key>).
 */
// TODO This filters setup should be transformed to listing's extended data setup
export const filters = [
  {
    id: 'category',
    label: 'Category',
    wizardPlaceholder: 'Choose…',
    wizardRequired: 'You need to select a category.',
    type: 'SelectSingleFilter',
    group: 'primary',
    queryParamNames: ['pub_category'],
    config: {
      // Schema type is enum for SelectSingleFilter
      schemaType: 'enum',

      // "key" is the option you see in Flex Console.
      // "label" is set here for the UI only.
      // Note: label is not added through the translation files
      // to make filter customizations a bit easier.
      options: [
        { key: 'men', label: 'Men' },
        { key: 'women', label: 'Women' },
        { key: 'kids', label: 'Kids' },
      ],
    },
  },
  {
    id: 'size',
    label: 'Size (US)',
    wizardPlaceholder: 'Choose…',
    wizardRequired: 'You need to select a size.',
    type: 'SelectMultipleFilter',
    group: 'primary',
    queryParamNames: ['pub_size'],
    config: {
      // Schema type options: 'enum', 'multi-enum'
      // Both types can work so that user selects multiple values when filtering search results.
      // With "enum" the functionality will be OR-semantics (Nike OR Adidas OR Salomon)
      // With "multi-enum" it's possible to use both AND and OR semantics with searchMode config.
      schemaType: 'enum',

      // "key" is the option you see in Flex Console.
      // "label" is set here for the UI only.
      // Note: label is not added through the translation files
      // to make filter customizations a bit easier.
      options: [
        { key: '4', label: '4' },
        { key: '5', label: '5' },
        { key: '6', label: '6' },
        { key: '7', label: '7' },
        { key: '8', label: '8' },
        { key: '9', label: '9' },
        { key: '10', label: '10' },
        { key: '11', label: '11' },
        { key: '12', label: '12' },
      ],
    },
  },
  {
    id: 'brand',
    label: 'Brand',
    wizardPlaceholder: 'Choose…',
    wizardRequired: 'You need to select a brand.',
    type: 'SelectMultipleFilter',
    group: 'primary',
    queryParamNames: ['pub_brand'],
    config: {
      // Schema type options: 'enum', 'multi-enum'
      // Both types can work so that user selects multiple values when filtering search results.
      // With "enum" the functionality will be OR-semantics (Nike OR Adidas OR Salomon)
      // With "multi-enum" it's possible to use both AND and OR semantics with searchMode config.
      schemaType: 'enum',

      // "key" is the option you see in Flex Console.
      // "label" is set here for the UI only.
      // Note: label is not added through the translation files
      // to make filter customizations a bit easier.
      options: [
        { key: 'adidas', label: 'Adidas' },
        { key: 'air_jordan', label: 'Air Jordan' },
        { key: 'converse', label: 'Converse' },
        { key: 'new_balance', label: 'New Balance' },
        { key: 'nike', label: 'Nike' },
        { key: 'puma', label: 'Puma' },
        { key: 'ultraboost', label: 'Ultraboost' },
        { key: 'vans', label: 'Vans' },
        { key: 'yeezy', label: 'Yeezy' },
        { key: 'other', label: 'Other' },
      ],
    },
  },
  {
    id: 'price',
    label: 'Price',
    type: 'PriceFilter',
    group: 'primary',
    // Note: PriceFilter is fixed filter,
    // you can't change "queryParamNames: ['price'],"
    queryParamNames: ['price'],
    // Price filter configuration
    // Note: unlike most prices this is not handled in subunits
    config: {
      min: 0,
      max: 1000,
      step: 5,
    },
  },
  {
    id: 'keyword',
    label: 'Keyword',
    type: 'KeywordFilter',
    group: 'primary',
    // Note: KeywordFilter is fixed filter,
    // you can't change "queryParamNames: ['keywords'],"
    queryParamNames: ['keywords'],
    // NOTE: If you are ordering search results by distance
    // the keyword search can't be used at the same time.
    // You can turn on/off ordering by distance from config.js file.
    config: {},
  },

  // Here is an example of multi-enum search filter.
  //
  // {
  //   id: 'amenities',
  //   label: 'Amenities',
  //   type: 'SelectMultipleFilter',
  //   group: 'secondary',
  //   queryParamNames: ['pub_amenities'],
  //   config: {
  //     // Schema type options: 'enum', 'multi-enum'
  //     // Both types can work so that user selects multiple values when filtering search results.
  //     // With "enum" the functionality will be OR-semantics (Nike OR Adidas OR Salomon)
  //     // With "multi-enum" it's possible to use both AND and OR semantics with searchMode config.
  //     schemaType: 'multi-enum',

  //     // Optional modes: 'has_all', 'has_any'
  //     // Note: this is relevant only for schema type 'multi-enum'
  //     // https://www.sharetribe.com/api-reference/marketplace.html#extended-data-filtering
  //     searchMode: 'has_all',

  //     // "key" is the option you see in Flex Console.
  //     // "label" is set here for this web app's UI only.
  //     // Note: label is not added through the translation files
  //     // to make filter customizations a bit easier.
  //     options: [
  //       { key: 'towels', label: 'Towels' },
  //       { key: 'bathroom', label: 'Bathroom' },
  //       { key: 'swimming_pool', label: 'Swimming pool' },
  //       { key: 'barbeque', label: 'Barbeque' },
  //     ],
  //   },
  // },
];

export const sortConfig = {
  // Enable/disable the sorting control in the SearchPage
  active: true,

  // Note: queryParamName 'sort' is fixed,
  // you can't change it since Flex API expects it to be named as 'sort'
  queryParamName: 'sort',

  // Internal key for the relevance option, see notes below.
  relevanceKey: 'relevance',

  // Relevance key is used with keywords filter.
  // Keywords filter also sorts results according to relevance.
  relevanceFilter: 'keywords',

  // Keyword filter is sorting the results by relevance.
  // If keyword filter is active, one might want to disable other sorting options
  // by adding 'keyword' to this list.
  conflictingFilters: [],

  options: [
    { key: 'createdAt', label: 'Newest' },
    { key: '-createdAt', label: 'Oldest' },
    { key: '-price', label: 'Lowest price' },
    { key: 'price', label: 'Highest price' },

    // The relevance is only used for keyword search, but the
    // parameter isn't sent to the Marketplace API. The key is purely
    // for handling the internal state of the sorting dropdown.
    { key: 'relevance', label: 'Relevance', longLabel: 'Relevance (Keyword search)' },
  ],
};

export const listing = {
  // These should be listing details from public data with schema type: enum
  // SectionDetailsMaybe component shows these on listing page.
  enumFieldDetails: ['size', 'brand', 'category'],
};
