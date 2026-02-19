-- FUNCTION: public.fn_register_user(character varying, character varying, character varying, uuid, uuid, character varying, text, text, text, text, user_role_enum)

-- DROP FUNCTION IF EXISTS public.fn_register_user(character varying, character varying, character varying, uuid, uuid, character varying, text, text, text, text, user_role_enum);

CREATE OR REPLACE FUNCTION public.fn_register_user(
	p_first_name character varying,
	p_last_name character varying,
	p_email character varying,
	p_country_code_id uuid,
	p_language_id uuid,
	p_phone_number character varying,
	p_password text,
	p_profile_image text,
	p_cover_image text,
	p_biography text,
	p_role user_role_enum)
    RETURNS fn_return_type
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
	v_user_id UUID;
	v_is_verifed BOOLEAN;
	v_error TEXT;
	v_message TEXT;
BEGIN
	IF EXISTS(
		SELECT 1 FROM tbl_users
		WHERE email = p_email
		AND is_deleted = FALSE
	) THEN
		v_message := 'Email Already Registered';
		RETURN (
			FALSE,
			v_message,
			NULL :: jsonb
		);
	END IF;

	-- Insert User data into table.
	INSERT INTO tbl_users(
		first_name,
		last_name,
		email,
		country_code_id,
		language_id,
		phone_number,
		password,
		profile_image,
		cover_image,
		biography,
		role
	)
	VALUES(
		p_first_name,
		p_last_name,
		p_email,
		p_country_code_id,
		p_language_id,
		p_phone_number,
		p_password,
		p_profile_image,
		p_cover_image,
		p_biography,
		p_role
	) RETURNING user_id, is_verified INTO v_user_id, v_is_verifed;

	
	-- Return response
	 v_message:= 'User Registered Successfully';
	RETURN (
		TRUE,
		v_message,
		 jsonb_build_object(
			'userId', v_user_id,
			'isVerified', v_is_verifed
		)
	);

EXCEPTION
	WHEN OTHERS THEN
		v_error := SQLERRM;
		RAISE NOTICE 'REGISTER USER ERROR: %', v_error;

		RETURN (
			FALSE,
			v_error,
			NULL :: jsonb
		);
END;
$BODY$;

ALTER FUNCTION public.fn_register_user(character varying, character varying, character varying, uuid, uuid, character varying, text, text, text, text, user_role_enum)
    OWNER TO neondb_owner;
