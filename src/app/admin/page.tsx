import ImageUpload from "@/components/ImageUpload";
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
				<ImageUpload />
			</main>
		</div>
	);
}
