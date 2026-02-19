-- FUNCTION: public.fn_login_user(character varying, character varying)

-- DROP FUNCTION IF EXISTS public.fn_login_user(character varying, character varying);

CREATE OR REPLACE FUNCTION public.fn_login_user(
	p_email character varying,
	p_hashed_password character varying)
    RETURNS fn_return_type
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
	v_error TEXT;
	v_message TEXT;
	v_user RECORD;
BEGIN
	-- Check user exists or not
	SELECT user_id, is_verified, password
	INTO v_user
	FROM tbl_users
	WHERE is_deleted=FALSE AND
		is_disabled=FALSE;
		
	
	--check user exists or not
	IF NOT FOUND THEN
		v_message := 'User not found.';
		RETURN (
			FALSE,
			v_message,
			null::jsonb
		);
	END IF;
	

	-- Check user is verified or not
	IF v_user.is_verified = FALSE THEN
		v_message := 'User is not verified';
		RETURN(
			FALSE,
			v_message,
			null::jsonb
		);
	END IF;

	-- Compare the hashed password with the actual password
	IF v_user.password <> p_hashed_password THEN
		v_message := 'Invalid credentials';
		RETURN(
			FALSE,
			v_message,
			null::jsonb
		);
	END IF;

	--login successfull
	RETURN(
		TRUE,
		'Login Successfull' :: text,
		null::jsonb
	);
EXCEPTION
	WHEN OTHERS THEN
		v_error := SQLERRM;
		RAISE NOTICE 'LOGIN USER ERROR: %', v_error;

		RETURN (
			FALSE,
			v_error,
			NULL :: jsonb
		);
END;
$BODY$;

ALTER FUNCTION public.fn_login_user(character varying, character varying)
    OWNER TO neondb_owner;
