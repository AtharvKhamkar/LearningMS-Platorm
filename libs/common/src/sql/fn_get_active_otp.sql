-- FUNCTION: public.fn_get_active_otp(text, otp_purpose)

-- DROP FUNCTION IF EXISTS public.fn_get_active_otp(text, otp_purpose);

CREATE OR REPLACE FUNCTION public.fn_get_active_otp(
	p_user_email text,
	p_otp_purpose otp_purpose)
    RETURNS fn_return_type
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
	v_error TEXT;
	v_message TEXT;
	v_otp RECORD;
BEGIN

	-- fetch active otp
	SELECT uo.otp_id, uo.otp_hash
	INTO v_otp
	FROM tbl_user_otps uo
	LEFT JOIN tbl_users u 
	ON uo.user_id = u.user_id
	WHERE u.email = p_user_email
		AND uo.otp_purpose = p_otp_purpose
		AND uo.is_deleted = FALSE
		AND now() <= uo.expires_at
	ORDER BY uo.created_at DESC
	LIMIT 1;

	IF v_otp IS NULL THEN
		v_error := 'OTP expired or not found.';
		RETURN ROW(
			FALSE,
			v_error,
			NULL :: JSONB
		);
	END IF;

	v_message := 'OTP fetched successfully.';
	RETURN ROW(
		TRUE,
		v_message,
		jsonb_build_object(
			'otpId', v_otp.otp_id,
			'otpHash', v_otp.otp_hash
		)
	);
	
EXCEPTION
    WHEN OTHERS THEN
		v_error := SQLERRM;
		RAISE NOTICE 'GET ACTIVE OTP ERROR: %', v_error;
        RETURN ROW(
            FALSE,
            v_error,
            NULL::jsonb
        );
END;
$BODY$;

ALTER FUNCTION public.fn_get_active_otp(text, otp_purpose)
    OWNER TO neondb_owner;
