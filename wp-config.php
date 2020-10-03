<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'vivaldi' );

/** MySQL database username */
define( 'DB_USER', 'root' );

/** MySQL database password */
define( 'DB_PASSWORD', '' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'c<-c*5IpJBxn[!s5O6Fd.WOq|YoaI4* m#fokKi99{Z]yEm,C=2HqN(H)(Zv9.9Z' );
define( 'SECURE_AUTH_KEY',  '`03J^J$(S>dTjn!J^GHy9:>EA/u/x6[/ar(b.L$eQ&w~.!xj6}fu#H=:YlfV=0Rc' );
define( 'LOGGED_IN_KEY',    'FZv> _^er ]H(}b#>c[??DW{`7A^7OW[jSFSY7dzo8L%2[{q:mKdiV.2!<<6I!`;' );
define( 'NONCE_KEY',        '*wQ{RdUTRyy4btA3 -Lq,>[q:GbXC:]KygOhE4S`If9Gs3T=`>L HE>%rSS]v(>!' );
define( 'AUTH_SALT',        '-X@ra~&DoB1ColPg&+;Mg*SJ PfOpZ,F6TBl+t--2|k|_FB^>?HeH9g:gU#{Ge`n' );
define( 'SECURE_AUTH_SALT', ':@#QQF+[([i_AJ90rZbh4/mn9D!vf;o&s$9!DN<B@~@nG~{I,xPA1Z2Et|jnV2DL' );
define( 'LOGGED_IN_SALT',   '!klcX~+VOWzJ2S,o2ZUwsFO8s ;*_Mt(Fc|?;s3H01{&.ySGH,q^U$ 1FoYY}J*u' );
define( 'NONCE_SALT',       '=BVbjVQ:H(4? 2g7g7kz-5@&}}{K?E(BAylY$%)(_uM>7L:_jX_6~`5?]B/?!<-<' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
