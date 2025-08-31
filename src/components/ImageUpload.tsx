"use client";

import { useState } from "react";

export default function ImageUpload() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [tags, setTags] = useState("");
	const [isUploading, setIsUploading] = useState(false);
	const [message, setMessage] = useState("");

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setSelectedFile(e.target.files[0]);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedFile) {
			setMessage("Please select a file first.");
			return;
		}

		setIsUploading(true);
		setMessage("");

		const formData = new FormData();
		formData.append("file", selectedFile);
		formData.append("tags", tags);

		try {
			const response = await fetch("/api/images", {
				method: "POST",
				body: formData,
				credentials: "include",
			});

			const data = await response.json();

			if (response.ok) {
				setMessage("File uploaded successfully!");
				setSelectedFile(null);
				setTags("");
				(document.getElementById("file-input") as HTMLInputElement).value = "";
			} else {
				setMessage(data.error || "Failed to upload file.");
			}
		} catch (error) {
			setMessage("An error occurred while uploading the file.");
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div>
			<h2>Upload Image</h2>

			<form onSubmit={handleSubmit}>
				<div>
					<label>Select Image</label>
					<input
						id="file-input"
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						disabled={isUploading}
					/>
				</div>

				<div>
					<label>Tags (comma-separated)</label>
					<input
						type="text"
						value={tags}
						onChange={(e) => setTags(e.target.value)}
						placeholder="nature, landscape, sunset"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						disabled={isUploading}
					/>
				</div>

				<button
					type="submit"
					disabled={!selectedFile || isUploading}
					className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
				>
					{isUploading ? "Uploading..." : "Upload Image"}
				</button>
			</form>

			{message && (
				<div
					className={`mt-4 p-3 rounded-md ${
						message.includes("success")
							? "bg-green-100 text-green-800"
							: "bg-red-100 text-red-800"
					}`}
				>
					{message}
				</div>
			)}
		</div>
	);
}
