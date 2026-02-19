-- FUNCTION: public.fn_get_user_profile_details(uuid)

-- DROP FUNCTION IF EXISTS public.fn_get_user_profile_details(uuid);

CREATE OR REPLACE FUNCTION public.fn_get_user_profile_details(
	p_user_id uuid)
    RETURNS fn_return_type
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    v_error TEXT;
    v_message TEXT;
    v_data JSONB;
BEGIN
    SELECT jsonb_build_object(
        'userId', u.user_id,
        'firstName', u.first_name,
        'lastName', u.last_name,
        'email', u.email,
        'countryName', mcc.country_name,
        'languageName', mlc.language_name,
        'phoneNumber', u.phone_number,
        'profileImage', u.profile_image,
        'coverImage', u.cover_image,
        'biography', u.biography,
        'role', u.role,
        'isVerified', u.is_verified,
        'fcmToken', u.fcm_token,
        'createdAt', u.created_at,
        'updatedAt', u.updated_at
    )
    INTO v_data
    FROM tbl_users u
    LEFT JOIN mst_country_codes mcc
        ON u.country_code_id = mcc.country_code_id
    LEFT JOIN mst_language_codes mlc
        ON u.language_id = mlc.language_code_id
    WHERE u.user_id = p_user_id
      AND u.is_verified = TRUE
      AND u.is_disabled = FALSE
      AND u.is_deleted = FALSE;

	v_error := 'User not found.';
    IF v_data IS NULL THEN
        RETURN ROW(
            FALSE,
            v_error,
            NULL::JSONB
        );
    END IF;

	v_message:= 'User profile details fetched successfully';
    RETURN ROW(
        TRUE,
        v_message,
        v_data :: JSONB
    );

EXCEPTION
    WHEN OTHERS THEN
        v_error := SQLERRM;
        RAISE NOTICE 'GET PROFILE DETAILS ERROR: %', v_error;

        RETURN ROW(
            FALSE,
            v_error,
            NULL::JSONB
        );
END;
$BODY$;

ALTER FUNCTION public.fn_get_user_profile_details(uuid)
    OWNER TO neondb_owner;
