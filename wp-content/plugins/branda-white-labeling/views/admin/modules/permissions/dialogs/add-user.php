<div class="sui-dialog sui-dialog-alt sui-dialog-sm sui-fade-in branda-dialog-new" aria-hidden="true" tabindex="-1" id="branda-permissions-add-user">

	<div class="sui-dialog-overlay" data-a11y-dialog-hide></div>

	<div class="sui-dialog-content sui-bounce-in" aria-labelledby="dialogTitle" aria-describedby="dialogDescription" role="dialog">

		<div class="sui-box" role="document">

				<div class="sui-box-header sui-block-content-center">

					<h3 class="sui-box-title" id="dialogTitle"><?php esc_html_e( 'Add User', 'ub' ); ?></h3>

					<div class="sui-actions-right">
						<button data-a11y-dialog-hide class="sui-dialog-close" aria-label="<?php esc_html_e( 'Close this dialog window', 'ub' ); ?>"></button>
					</div>

				</div>

				<div class="sui-box-body sui-box-body-slim sui-block-content-center">
					<?php $is_large = is_multisite() && wp_is_large_network( 'users' ); ?>
					<p id="dialogDescription" class="sui-description">
						<?php echo $is_large
							? esc_html__( 'Input the user login or email in the box to add. You can add as many users as you like.', 'ub' )
							: esc_html__( 'Type the username in the searchbox to add. You can add as many users as you like.', 'ub' ); ?></p>

					<div class="sui-form-field">
						<label class="sui-label" for="searchuser"><?php echo  $is_large ? esc_html__('User login or email', 'ub') : esc_html__('Search users', 'ub'); ?></label>
						<div class="sui-control-with-icon">
							<?php if ( $is_large ) { ?>
								<input id="user_login" placeholder="<?php esc_html_e('User login or email', 'ub'); ?>" class="sui-form-control" />
							<?php } else { ?>
								<select class="sui-select sui-form-control"
										id="searchuser"
										name="user"
										data-placeholder="<?php esc_html_e( 'Type Username', 'ub' ); ?>"
										data-hash="<?php echo esc_attr( wp_create_nonce( 'usersearch' ) ); ?>"
										data-language-searching="<?php esc_attr_e( 'Searching...', 'ub' ); ?>"
										data-language-noresults="<?php esc_attr_e( 'No results found', 'ub' ); ?>"
										data-language-error-load="<?php esc_attr_e( 'Searching...', 'ub' ); ?>"
								>
								</select>
							<?php } ?>
							<i class="sui-icon-profile-male" aria-hidden="true"></i>
						</div>
					</div>
				</div>

				<div class="sui-box-footer">

					<a class="sui-button sui-button-ghost" data-a11y-dialog-hide><?php esc_html_e( 'Cancel', 'ub' ); ?></a>

					<button class="sui-button branda-permissions-add-user" data-nonce="<?php echo esc_attr( wp_create_nonce( 'add_user' ) ); ?>">
						<span class="sui-loading-text"><i class="sui-icon-check" aria-hidden="true"></i><?php esc_html_e( 'Add', 'ub' ); ?></span>
						<span class="sui-loading-text-adding"><i class="sui-icon-loader" aria-hidden="true"></i><?php esc_html_e( 'Adding', 'ub' ); ?></span>
					</button>

				</div>

		</div>

	</div>

</div>
