import Header from "@/components/Header";
import { ImageMeta } from "@/interfaces/image";
import "@/styles/Gallery.scss";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Paginator from "@/components/Paginator";
import { PaginatorPosition } from "@/interfaces/paginator";
import LazyImage from "@/components/LazyImage";
import Footer from "@/components/Footer";

export default function Gallery() {
  const navigate = useNavigate();
  const location = useLocation();
  const [images, setImages] = useState<ImageMeta[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageMeta[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [columns, setColumns] = useState<ImageMeta[][]>([[], [], [], []]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null); // State for full-screen image

  const imagesPerPage = 40;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/images/images.json");
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        setImages(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching images:", error);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tag = queryParams.get("tag");

    if (tag) {
      // Filter images by the tag
      const filtered = images.filter((image) => Array.isArray(image.tags) && image.tags.includes(tag));
      setFilteredImages(filtered);
    } else {
      // If no tag is set, display all images
      setFilteredImages(images);
    }
  }, [location.search, images]);

  useEffect(() => {
    const getTags = () => {
      const allTags = images.flatMap((image) => (Array.isArray(image.tags) ? image.tags : []));
      const uniqueTagsSet = new Set(allTags);
      setTags(Array.from(uniqueTagsSet));
    };

    const updateColumns = () => {
      let columnCount = 4; // Default to 4 columns
      const width = window.innerWidth;

      if (width <= 600) {
        columnCount = 1;
      } else if (width <= 900) {
        columnCount = 2;
      } else if (width <= 1200) {
        columnCount = 3;
      }

      // Get the images for the current page
      const startIndex = (currentPage - 1) * imagesPerPage;
      const endIndex = startIndex + imagesPerPage;
      const paginatedImages = filteredImages.slice(startIndex, endIndex);

      // Distribute images into the calculated number of columns
      const newColumns: ImageMeta[][] = Array.from({ length: columnCount }, () => []);
      paginatedImages.forEach((image, index) => {
        newColumns[index % columnCount].push(image);
      });
      setColumns(newColumns);
    };

    updateColumns();
    getTags();
    window.addEventListener("resize", updateColumns);

    return () => window.removeEventListener("resize", updateColumns);
  }, [filteredImages, currentPage, images]);

  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);

  useEffect(() => {
    // Check if the "image" query parameter is set
    const queryParams = new URLSearchParams(location.search);
    const imagePath = queryParams.get("image");
    const pageFromQuery = parseInt(queryParams.get("page") || "1", 10);

    if (imagePath) {
      // Open full-screen mode with the specified image
      setFullScreenImage(`/images/${imagePath}`);
    }

    if (!isNaN(pageFromQuery) && pageFromQuery > 0) {
      setCurrentPage(pageFromQuery);
    } else {
      setCurrentPage(1); // Default to page 1 if invalid
    }
  }, [location.search]);

  useEffect(() => {
    if (fullScreenImage) {
      // Update the query parameter with the relative path of the full-screen image
      const queryParams = new URLSearchParams(location.search);
      const relativePath = fullScreenImage.replace("/images/", "");
      queryParams.set("image", relativePath);
      navigate(`?${queryParams.toString()}`, { replace: true });

      // Disable scrolling
      document.body.style.overflow = "hidden";
    } else {
      // Remove the "image" query parameter when exiting full-screen mode
      const queryParams = new URLSearchParams(location.search);
      queryParams.delete("image");
      navigate(`?${queryParams.toString()}`, { replace: true });

      // Re-enable scrolling
      document.body.style.overflow = "";
    }

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [fullScreenImage, location.search, navigate]);

  useEffect(() => {
    // Update the "page" query parameter whenever the current page changes
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", currentPage.toString());
    navigate(`?${queryParams.toString()}`, { replace: true });
  }, [currentPage, location.search, navigate]);

  useEffect(() => {
    // Reset to page 1 if the current page exceeds the total number of pages
    const totalPages = Math.ceil(filteredImages.length / imagesPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredImages, currentPage]);

  return (
    <>
      <Header />
      <div className="gallery">
        <div className="tags">
          <span
            key="all"
            className={`tags__tag ${!new URLSearchParams(location.search).get("tag") ? "tags__tag--active" : ""}`}
            onClick={() => navigate("")}
          >
            All
          </span>
          {tags.map((tag, index) => {
            const queryParams = new URLSearchParams(location.search);
            const activeTag = queryParams.get("tag");

            return (
              <span
                key={index}
                className={`tags__tag ${activeTag === tag ? "tags__tag--active" : ""}`}
                onClick={() => navigate(`?tag=${encodeURIComponent(tag)}`)}
              >
                {tag}
              </span>
            );
          })}
        </div>

        <Paginator currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} position={PaginatorPosition.TOP} />

        <div className="images">
          {!loading && filteredImages.length === 0 && <p>No images found</p>}
          {!loading &&
            columns.map((column, columnIndex) => (
              <div className="images__column" key={columnIndex}>
                {column.map((image) => (
                  <LazyImage
                    key={uuidv4()}
                    src={`/images/${image.relative_path}`}
                    alt={image.relative_path}
                    onClick={() => setFullScreenImage(`/images/${image.relative_path}`)} // Open full-screen view
                  />
                ))}
              </div>
            ))}
        </div>

        <Paginator currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} position={PaginatorPosition.BOTTOM} />

        {/* Full-Screen Modal */}
        {fullScreenImage && (
          <div className="fullscreen-modal" onClick={() => setFullScreenImage(null)}>
            <img src={fullScreenImage} alt="Full Screen" />
            <button
              className="close-button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent closing when clicking the button
                setFullScreenImage(null);
              }}
            >
              &times;
            </button>

            {/* Left Arrow */}
            <button
              className="arrow-button arrow-button--left"
              onClick={(e) => {
                e.stopPropagation(); // Prevent closing when clicking the button
                const currentIndex = filteredImages.findIndex((image) => `/images/${image.relative_path}` === fullScreenImage);
                if (currentIndex > 0) {
                  setFullScreenImage(`/images/${filteredImages[currentIndex - 1].relative_path}`);
                }
              }}
            >
              &#8249;
            </button>

            {/* Right Arrow */}
            <button
              className="arrow-button arrow-button--right"
              onClick={(e) => {
                e.stopPropagation(); // Prevent closing when clicking the button
                const currentIndex = filteredImages.findIndex((image) => `/images/${image.relative_path}` === fullScreenImage);
                if (currentIndex < filteredImages.length - 1) {
                  setFullScreenImage(`/images/${filteredImages[currentIndex + 1].relative_path}`);
                }
              }}
            >
              &#8250;
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
