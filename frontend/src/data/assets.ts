export const ASSET_PREFIX = '/static/assets/'

export const asset = (path: string) => `${ASSET_PREFIX}${path}`

export const icons = {
  search: asset('icons/png/128/search_default.png'),
  calendar: asset('icons/png/128/calendar_orange.png'),
  chefHat: asset('icons/png/128/chef_hat_orange.png'),
  clock: asset('icons/png/128/clock_default.png'),
  clockOrange: asset('icons/png/128/clock_orange.png'),
  people: asset('icons/png/128/people_green.png'),
  star: asset('icons/png/128/star_orange.png'),
  plus: asset('icons/png/128/plus_orange.png'),
  minus: asset('icons/png/128/minus_default.png'),
  back: asset('icons/png/128/back_default.png'),
  more: asset('icons/png/128/more_default.png'),
  edit: asset('icons/png/128/edit_orange.png'),
  check: asset('icons/png/128/check_green.png'),
  fire: asset('icons/png/128/fire_orange.png'),
  timer: asset('icons/png/128/timer_orange.png'),
  upload: asset('icons/png/128/upload_orange.png'),
  camera: asset('icons/png/128/camera_orange.png'),
  note: asset('icons/png/128/note_orange.png'),
  history: asset('icons/png/128/history_green.png'),
  settings: asset('icons/png/128/settings_default.png'),
  bell: asset('icons/png/128/bell_default.png'),
  database: asset('icons/png/128/database_orange.png'),
  help: asset('icons/png/128/help_orange.png'),
  heart: asset('icons/png/128/heart_orange.png'),
  cookbook: asset('illustrations/png/cookbook_256.png'),
  pan: asset('illustrations/png/frying_pan_256.png'),
  pot: asset('illustrations/png/pot_heart_256.png'),
  basket: asset('illustrations/png/vegetable_basket_256.png'),
  avatar: asset('illustrations/png/chef_avatar_256.png'),
  empty: asset('illustrations/png/empty_dishes_256.png'),
  uploadPlaceholder: asset('illustrations/png/upload_placeholder_256.png')
}

export const tabIcons = {
  home: {
    default: asset('icons/png/128/tab_home_default.png'),
    active: asset('icons/png/128/tab_home_active.png')
  },
  dishes: {
    default: asset('icons/png/128/tab_dish_book_default.png'),
    active: asset('icons/png/128/tab_dish_book_active.png')
  },
  menu: {
    default: asset('icons/png/128/tab_menu_clipboard_default.png'),
    active: asset('icons/png/128/tab_menu_clipboard_active.png')
  },
  cook: {
    default: asset('icons/png/128/tab_cook_pot_default.png'),
    active: asset('icons/png/128/tab_cook_pot_active.png')
  },
  mine: {
    default: asset('icons/png/128/tab_mine_user_default.png'),
    active: asset('icons/png/128/tab_mine_user_active.png')
  }
}
