import pygame as pg

#Graphical representation settings
LEVEL_RESOLUTIONS = [(800, 640), (950, 480), (950, 610), (400, 800), (500, 700)] #The resolutions of the levels in pixels (DO NOT CHANGE)
                    # start menu, level 1, level 2, level 3, end screen
SCREEN_WIDTH, SCREEN_HEIGHT = LEVEL_RESOLUTIONS[0] #The width and height of the screen in pixels (DO NOT CHANGE)
MAX_FPS = 60 #The maximum frames per second the game should run at (suggested: 60)
PAUSE_MENU_BACKGROUND_ALPHA = 128 #The alpha value of the background of the pause menu (suggested: 128)

#Miscellaneous graphical representation settings
PORTAL_ANIMATION_SWITCHING_DELAY = 10 #After how many frames the portal animation should progress (suggested: 10)
BRIGHTNESS_CONTROL_INTERVAL = 8 #The interval in seconds at which the monitor brightness should be checked (suggested: 8)
EFFECTS_ANIMATION_SWITCHING_DELAY = 10 #After how many frames the effects animation should progress (suggested: 10)

#Physics simulation settings
MAX_ENTITY_SPEED = 4 #The maximum speed of any entity in pixels per frame (suggested: 4)
FALLING_SPEED_INCR = 1 #The speed at which the player falls in pixels per frame (suggested: 1)
PLAYER_GRAVITY_PULL_DELAY = 2 #The delay in frames between gravity pulls on the player (suggested: 2)
BASE_GRAVITY_PULL = FALLING_SPEED_INCR #The base gravity pull any entity with simulated physics (suggested: FALLING_SPEED_INCR)
MAX_DOWN_VELOCITY = 16 #The maximum speed the player can fall at in pixels per frame (should be multiple of FALLING_SPEED_INCR) (suggested: 16)
MAX_UP_VELOCITY = -30 #The maximum speed the player can jump at in pixels per frame (should be multiple of FALLING_SPEED_INCR) (suggested: -30)
HOR_KNOCKBACK_STRENGTH = 5 #The strength of the horizontal knockback in pixels per frame (suggested: 5)
VERT_KNOCKBACK_STRENGTH = 5 #The strength of the vertical knockback in pixels per frame (suggested: 5)

#Player movement settings
PLAYER_SPEED = 2 #The speed of the player in pixels per frame while on the ground (suggested: 2)
PLAYER_SPEED_MID_AIR = PLAYER_SPEED // 2  #The speed of the player in pixels per frame while in mid air (suggested: PLAYER_SPEED / 2)
PLAYER_ANIMATION_SWITCHING_DELAY = 15  #After how many frames the animation of the player should progress (suggested: 12)
BASE_JUMP_SPEED = -8 #Initial player jump speed in pixel per frame (negative value for jumping up) (suggested: -8 --> value has to be negative)
INITIAL_COORDS_PLAYER = [(50, 501), (50, 339), (887, 460), (45, 63)] #Initial coordinates the player should have in each level (midbottom) (DO NOT CHANGE)

#Audio settings
MUSIC_VOLUME = 0.1 #The volume of the music (suggested: 0.5)
WORLD_SOUNDS_VOLUME = 0.3 #The volume of the world sounds (suggested: 0.5)
UI_SOUNDS_VOLUME = 0.3 #The volume of the UI sounds (suggested: 0.5)

#Key bindings (see below for key constants)
PLAYER_LEFT_KEY = pg.K_a #The key to move the player left (suggested: pygame.K_a)
PLAYER_RIGHT_KEY = pg.K_d #The key to move the player right (suggested: pygame.K_d)
PLAYER_JUMP_KEY = pg.K_SPACE #The key to make the player jump (suggested: pygame.K_SPACE)
PAUSE_KEY = pg.K_ESCAPE #The key to pause the game (suggested: pygame.K_ESCAPE)
QUICK_RESTART_KEY = pg.K_r #The key to quickly restart the level (suggested: pygame.K_r)
QUICK_EXIT_KEY = pg.K_p #The key to quickly exit the game (suggested: pygame.K_p)

r""" r stands for raw string inserted to avoid a syntax warning every time the program is begin run
Pygame key constants
Constant      ASCII   Description
---------------------------------
K_BACKSPACE   \b      backspace
K_TAB         \t      tab
K_CLEAR               clear
K_RETURN      \r      return
K_PAUSE               pause
K_ESCAPE      ^[      escape
K_SPACE               space
K_EXCLAIM     !       exclaim
K_QUOTEDBL    "       quotedbl
K_HASH        #       hash
K_DOLLAR      $       dollar
K_AMPERSAND   &       ampersand
K_QUOTE               quote
K_LEFTPAREN   (       left parenthesis
K_RIGHTPAREN  )       right parenthesis
K_ASTERISK    *       asterisk
K_PLUS        +       plus sign
K_COMMA       ,       comma
K_MINUS       -       minus sign
K_PERIOD      .       period
K_SLASH       /       forward slash
K_0           0       0
K_1           1       1
K_2           2       2
K_3           3       3
K_4           4       4
K_5           5       5
K_6           6       6
K_7           7       7
K_8           8       8
K_9           9       9
K_COLON       :       colon
K_SEMICOLON   ;       semicolon
K_LESS        <       less-than sign
K_EQUALS      =       equals sign
K_GREATER     >       greater-than sign
K_QUESTION    ?       question mark
K_AT          @       at
K_LEFTBRACKET [       left bracket
K_BACKSLASH   \       backslash
K_RIGHTBRACKET ]      right bracket
K_CARET       ^       caret
K_UNDERSCORE  _       underscore
K_BACKQUOTE   `       grave
K_a           a       a
K_b           b       b
K_c           c       c
K_d           d       d
K_e           e       e
K_f           f       f
K_g           g       g
K_h           h       h
K_i           i       i
K_j           j       j
K_k           k       k
K_l           l       l
K_m           m       m
K_n           n       n
K_o           o       o
K_p           p       p
K_q           q       q
K_r           r       r
K_s           s       s
K_t           t       t
K_u           u       u
K_v           v       v
K_w           w       w
K_x           x       x
K_y           y       y
K_z           z       z
K_DELETE              delete
K_KP0                 keypad 0
K_KP1                 keypad 1
K_KP2                 keypad 2
K_KP3                 keypad 3
K_KP4                 keypad 4
K_KP5                 keypad 5
K_KP6                 keypad 6
K_KP7                 keypad 7
K_KP8                 keypad 8
K_KP9                 keypad 9
K_KP_PERIOD   .       keypad period
K_KP_DIVIDE   /       keypad divide
K_KP_MULTIPLY *       keypad multiply
K_KP_MINUS    -       keypad minus
K_KP_PLUS     +       keypad plus
K_KP_ENTER    \r      keypad enter
K_KP_EQUALS   =       keypad equals
K_UP                  up arrow
K_DOWN                down arrow
K_RIGHT               right arrow
K_LEFT                left arrow
K_INSERT              insert
K_HOME                home
K_END                 end
K_PAGEUP              page up
K_PAGEDOWN            page down
K_F1                  F1
K_F2                  F2
K_F3                  F3
K_F4                  F4
K_F5                  F5
K_F6                  F6
K_F7                  F7
K_F8                  F8
K_F9                  F9
K_F10                 F10
K_F11                 F11
K_F12                 F12
K_F13                 F13
K_F14                 F14
K_F15                 F15
K_NUMLOCK             numlock
K_CAPSLOCK            capslock
K_SCROLLOCK           scrollock
K_RSHIFT              right shift
K_LSHIFT              left shift
K_RCTRL               right control
K_LCTRL               left control
K_RALT                right alt
K_LALT                left alt
K_RMETA               right meta
K_LMETA               left meta
K_LSUPER              left Windows key
K_RSUPER              right Windows key
K_MODE                mode shift
K_HELP                help
K_PRINT               print screen
K_BREAK               break
K_MENU                menu
"""