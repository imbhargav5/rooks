/**
 * @jest-environment jsdom
 */
// eslint-disable @typescript-eslint/ban-ts-comment
import React from "react";
import {useWebOtp} from '../hooks/useWebOtp';
import {
	render,
	cleanup,
	fireEvent,
	act,
	getByTestId,
	waitFor,
} from '@testing-library/react';

function MockGetWebOtpHook() {
		const [when, setWhen] = React.useState(false);
		const webOtpObject = useWebOtp({
			when
		});

		return (
			<div className="App">
				<button
					data-testid="get-webOtp-btn"
					onClick={() => {
						setWhen(true);
					}}
					type="button"
				>
					Enable WebOtp
				</button>
				<button
					data-testid="abort-webOtp-btn"
					onClick={() => {
						setWhen(false);
						webOtpObject.abort();
					}}
					type="button"
				>
					Cancel WebOtp listener
				</button>

				<p data-testid="otp-info">{webOtpObject && JSON.stringify(webOtpObject)}</p>
			</div>
		);
}

describe("useWebOtp", () => {
	beforeEach(() => {
		const mockGetCredentials = {
			get: jest.fn()
				.mockImplementationOnce(() => Promise.resolve({
					code: "123456",
					type: "otp"
				}))
		};

		// @ts-expect-error
		global.navigator.credentials = mockGetCredentials;
		// @ts-expect-error
		window.OTPCredential = jest.fn();
	});

	afterEach(cleanup)

	it("should be defined", () => {
		expect(useWebOtp).toBeDefined();
	});

	it("click on get webOtp gives otp code and its type", async () => {
		let container
		act(() => {
			container = render(<MockGetWebOtpHook />).container;
		})

		const getWebOtpButton = getByTestId(container, "get-webOtp-btn");
		const otpInfoElement = getByTestId(container, "otp-info");

		act(() => {
			fireEvent.click(getWebOtpButton)
		})

		await waitFor(
			() => {
				const otpInfo = JSON.parse(otpInfoElement.innerHTML)

				expect(`${otpInfo.code}`).toBe("123456")
				expect(`${otpInfo.type}`).toBe("otp")
			},
			{
				timeout: 1_000,
			}
		);
	})
});
