"use client";

import { useActionState } from "react";
import { authenticate } from "@/lib/actions";

export default function LoginForm() {
	const [errorMessage, dispatch, isPending] = useActionState(
		authenticate,
		undefined
	);

	return (
		<form action={dispatch} className="space-y-6">
			<div>
				<label htmlFor="token">Admin Token</label>
				<div className="mt-1">
					<input
						id="token"
						name="token"
						type="password"
						required
						placeholder="Enter your admin token"
						disabled={isPending}
					/>
				</div>
			</div>

			{errorMessage && (
				<div>
					<p>{errorMessage}</p>
				</div>
			)}

			<div>
				<button type="submit" disabled={isPending}>
					{isPending ? "Verifying..." : "Sign in"}
				</button>
			</div>
		</form>
	);
}
