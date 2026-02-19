-- FUNCTION: public.fn_set_inactive_otp(uuid)

-- DROP FUNCTION IF EXISTS public.fn_set_inactive_otp(uuid);

CREATE OR REPLACE FUNCTION public.fn_set_inactive_otp(
	p_otp_id uuid)
    RETURNS fn_return_type
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
	v_error TEXT;
	v_message TEXT;
BEGIN

	--update the otp as inactive
	UPDATE tbl_user_otps
	SET is_deleted = TRUE,
		updated_at = NOW()
	WHERE otp_id = p_otp_id
		AND is_deleted = FALSE;

	IF NOT FOUND THEN
		v_error := 'OTP not found or already used.';
		RETURN ROW(
			FALSE,
			v_error,
			NULL :: JSONB
		);
	END IF;

	v_message := 'OTP marked inactive successfully.';
	RETURN ROW(
		TRUE,
		v_message,
		NULL :: JSONB
	);

EXCEPTION
    WHEN OTHERS THEN
		v_error := SQLERRM;
		RAISE NOTICE 'SET INACTIVE OTP ERROR: %', v_error;
        RETURN ROW(
            FALSE,
            v_error,
            NULL::jsonb
        );
	
END;
$BODY$;

ALTER FUNCTION public.fn_set_inactive_otp(uuid)
    OWNER TO neondb_owner;
