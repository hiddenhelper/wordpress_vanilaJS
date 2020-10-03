<?php
/**
 * Plugin Name: Pods Advanced Permalinks Add-On
 * Plugin URI: https://pods.io
 * Description: Adds custom permalinks handling for taxonomy archives and term links.
 * Version: 0.1
 * Author: Pods Framework Team
 * Author URI: https://pods.io
 * License: GPL-2.0+
 * Text Domain: pods-advanced-permalinks
 */

namespace Pods\Advanced_Permalinks_Temporary;

/**
 * Get list of post types and their taxonomies to handle rewrites for.
 *
 * @return \string[][] List of post types.
 */
function get_covered_content_types() {
	return [
		'what_we_do'   => [
			'industries',
		],
		'how_we_think' => [
			'content_types',
			'expertise',
		],
		'join_us'      => [
			'job_skills',
			'job_locations',
		],
	];
}

/**
 * Get list of taxonomies and their primary post types.
 *
 * @return \string[] List of taxonomies and their primary post types.
 */
function get_primary_taxonomies() {
	return [
		'industries'    => 'what_we_do',
		'content_types' => 'how_we_think',
		'expertise'     => 'how_we_think',
		'job_skills'    => 'join_us',
		'job_locations' => 'join_us',
	];
}

/**
 * Get list of taxonomies that should have an "all" archive.
 *
 * @return \string[] List of taxonomies that should have an "all" archive.
 */
function get_taxonomies_with_all() {
	return [
		'job_skills',
		'job_locations',
	];
}

/**
 * Register rewrites for covered content types.
 */
function register_rewrites() {
	$covered  = get_covered_content_types();
	$primary  = get_primary_taxonomies();
	$with_all = get_taxonomies_with_all();

	// Register all covered rewrites.
	foreach ( $covered as $post_type => $taxonomies ) {
		foreach ( $taxonomies as $taxonomy ) {
			// Skip primary taxonomies.
			if ( isset( $primary[ $taxonomy ] ) ) {
				continue;
			}

			register_rewrites_for_taxonomy( $taxonomy, $post_type, \in_array( $taxonomy, $with_all, true ) );
		}
	}

	// Register rewrites for taxonomies with primary post type.
	foreach ( $primary as $taxonomy => $post_type ) {
		register_rewrites_for_taxonomy( $taxonomy, $post_type, \in_array( $taxonomy, $with_all, true ) );
	}
}

\add_action( 'init', __NAMESPACE__ . '\register_rewrites', 20 );

/**
 * Register rewrites for taxonomy.
 *
 * @param string  $taxonomy  Taxonomy name.
 * @param string  $post_type Post type name.
 * @param boolean $all       Whether to handle the "all" rewrite.
 */
function register_rewrites_for_taxonomy( $taxonomy, $post_type, $all = false ) {
	$taxonomy_obj  = \get_taxonomy( $taxonomy );
	$post_type_obj = \get_post_type_object( $post_type );

	if ( empty( $taxonomy_obj ) || empty( $post_type_obj ) ) {
		return;
	}

	// Handle /{post_type}/{taxonomy}/{term}/ that lists all posts for that post type and specific term.
	$term_rule  = "^{$post_type_obj->rewrite['slug']}/{$taxonomy_obj->rewrite['slug']}/";
	$term_query = "index.php?post_type={$post_type_obj->name}&pods_ap_terms_tax={$taxonomy_obj->name}";

	if ( $taxonomy_obj->hierarchical && $taxonomy_obj->rewrite[ 'hierarchical' ] ) {
		$term_rule .= '(.+?)/?$';
	} else {
		$term_rule .= '([^/]+)/?$';
	}

	if ( $taxonomy_obj->query_var ) {
		$term_query .= '&' . $taxonomy_obj->query_var . '=$matches[1]';
	} else {
		$term_query .= '&taxonomy=' . $taxonomy_obj->name . '&term=$matches[1]';
	}

	\add_rewrite_rule( $term_rule, $term_query, 'top' );

	if ( $all ) {
		// Handle /{post_type}/{taxonomy}/all/ that lists all posts for that post type, regardless of term.
		$all_rule  = "^{$post_type_obj->rewrite['slug']}/{$taxonomy_obj->rewrite['slug']}/?";
		$all_query = "index.php?post_type={$post_type_obj->name}&pods_ap_terms_all=1&pods_ap_terms_tax={$taxonomy_obj->name}";

		\add_rewrite_rule( $all_rule, $all_query, 'top' );
	}
}

/**
 * Handle custom term link.
 *
 * @param string  $termlink Term link URL.
 * @param WP_Term $term     Term object.
 * @param string  $taxonomy Taxonomy slug.
 *
 * @return string Term link URL.
 */
function filter_term_link( $termlink, $term, $taxonomy ) {
	$covered = get_covered_content_types();
	$primary = get_primary_taxonomies();

	if ( isset( $primary[ $taxonomy ] ) ) {
		$post_type = $primary[ $taxonomy ];
	} elseif ( \is_admin() ) {
		$post_type = null;
	} else {
		$post_type = \get_post_type();
	}

	if ( empty( $post_type ) || ! isset( $covered[ $post_type ] ) || ! \in_array( $taxonomy, $covered[ $post_type ], true ) ) {
		return $termlink;
	}

	// @todo Handle this.
	$post_type_obj = \get_post_type_object( $post_type );
	$taxonomy_obj  = \get_taxonomy( $taxonomy );

	return \home_url( "{$post_type_obj->rewrite['slug']}/{$taxonomy_obj->rewrite['slug']}/{$term->slug}/" );
}

\add_filter( 'term_link', __NAMESPACE__ . '\filter_term_link', 10, 3 );

function add_all_query_var( $query_vars ) {
	$query_vars[] = 'pods_ap_terms_all';
	$query_vars[] = 'pods_ap_terms_tax';

	return $query_vars;
}

\add_filter( 'query_vars', __NAMESPACE__ . '\add_all_query_var' );

/**
 * Force term archive by telling the query that it is not a post type archive.
 *
 * @return array List of posts found.
 * @var \WP_Query $query The query object.
 *
 * @var array     $posts List of posts found.
 */
function force_term_archive( $posts, $query ) {
	// Only show for pods_ap_terms_tax if pods_ap_terms_all is not on.
	if ( empty( $query->query_vars[ 'pods_ap_terms_tax' ] ) || ! empty( $query->query_vars[ 'pods_ap_terms_all' ] ) ) {
		return $posts;
	}

	$query->is_post_type_archive = false;

	return $posts;
}

\add_filter( 'the_posts', __NAMESPACE__ . '\force_term_archive', 10, 2 );
