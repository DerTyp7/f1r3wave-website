import { getAuthStatus } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function AdminPage() {
	const { isAuthenticated, user } = await getAuthStatus();

	if (!isAuthenticated) {
		redirect("/login");
	}

	return (
		<div className="py-10">
			<header>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
						Admin Dashboard
					</h1>
					<p className="mt-2 text-sm text-gray-600">
						Welcome, {user?.name}! You have successfully authenticated with
						admin privileges.
					</p>
				</div>
			</header>
			<main>
				<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
					{/* Add your admin content here */}
					<div className="px-4 py-8 sm:px-0">
						<div className="h-96 rounded-lg border-4 border-dashed border-gray-200">
							<div className="flex h-full items-center justify-center">
								<p className="text-gray-500">Admin content goes here</p>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
