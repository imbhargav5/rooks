import {useEffect, useState} from "react";

type OTPResponse = {
	type: string,
	code: string
}

type UseWebOtpHandler = {
	abort: () => void,
	code: string,
	error: Error | undefined,
	isSupported: boolean,
	type: string,
}

type WebOtpInput = {
	/**
	 * when boolean to enable and disable events, when passed false
	 * remove the web otp listener if any
	 *
	 * @default false
	 */
	when: boolean
}

function useWebOtp({
	when = false
}: WebOtpInput): UseWebOtpHandler {
	// Local cVariables
	const ac = new AbortController();
	const isSupported = 'OTPCredential' in window;
	// Hooks
	const [code, setCode] = useState("")
	const [type, setType] = useState("")
	const [error, setError] = useState()

	useEffect(() => {
		if (isSupported && when) {
			(async () => {
				try {
					const response = await navigator.credentials.get({
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-expect-error
						otp: {transport: ['sms']},
						signal: ac.signal
					})
					const otp = response as unknown as OTPResponse;

					setCode(otp.code);
					setType(otp.type);
				} catch (error_) {
					setCode("");
					setType("");

					setError(error_);
				}
			})();
		} else {
			ac.abort();
		}

		return () => {
			ac.abort();
		};
	}, [when])

	return {
		abort: () => {
			ac.abort()
		},
		code,
		error,
		isSupported,
		type
	};
}

export {useWebOtp};
