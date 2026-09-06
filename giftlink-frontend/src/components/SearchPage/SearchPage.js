import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import './SearchPage.css';

function SearchPage() {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [ageRange, setAgeRange] = useState(6);
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = [
        'Electronics',
        'Clothing',
        'Books',
        'Toys',
        'Furniture',
        'Other'
    ];

    const conditions = [
        'New',
        'Used'
    ];

    const handleSearch = async () => {
        setLoading(true);
        setError('');

        const queryParams = new URLSearchParams({
            name: searchQuery,
            age_years: ageRange,
            category: category,
            condition: condition
        }).toString();

        try {
            const response = await fetch(
                `${urlConfig.backendUrl}/api/search?${queryParams}`
            );

            if (!response.ok) {
                throw new Error(`Search failed: ${response.status}`);
            }

            const data = await response.json();

            setSearchResults(data);
        } catch (error) {
            console.error('Failed to fetch search results:', error);
            setError(error.message);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`);
    };

    return (
        <div className="container search-page mt-5">
            <h1 className="text-center mb-4">Search Gifts</h1>

            <div className="search-panel">

                {/* Search input */}
                <div className="search-input-container">
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Search by gift name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <button
                        className="btn btn-primary search-button"
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>

                {/* Category */}
                <div className="filter-group">
                    <label htmlFor="categorySelect">
                        Category
                    </label>

                    <select
                        id="categorySelect"
                        className="form-control"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All</option>

                        {categories.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Condition */}
                <div className="filter-group">
                    <label htmlFor="conditionSelect">
                        Condition
                    </label>

                    <select
                        id="conditionSelect"
                        className="form-control"
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                    >
                        <option value="">All</option>

                        {conditions.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Age */}
                <div className="filter-group">
                    <label htmlFor="ageRange">
                        Less than {ageRange} years
                    </label>

                    <input
                        type="range"
                        className="form-range"
                        id="ageRange"
                        min="1"
                        max="10"
                        value={ageRange}
                        onChange={(e) =>
                            setAgeRange(Number(e.target.value))
                        }
                    />
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="alert alert-danger mt-4">
                    Error: {error}
                </div>
            )}

            {/* Search results */}
            <div className="search-results mt-4">
                {searchResults.length > 0 ? (
                    <div className="row">
                        {searchResults.map((product) => (
                            <div
                                key={product.id}
                                className="col-md-4 mb-4"
                            >
                                <div className="card search-result-card h-100">

                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="card-img-top"
                                        />
                                    ) : (
                                        <div className="no-search-image">
                                            No Image Available
                                        </div>
                                    )}

                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {product.name}
                                        </h5>

                                        <p className="card-text">
                                            {product.description
                                                ? `${product.description.slice(0, 100)}...`
                                                : 'No description available.'}
                                        </p>

                                        <p className="card-text">
                                            <strong>Category:</strong>{' '}
                                            {product.category}
                                        </p>

                                        <p className="card-text">
                                            <strong>Condition:</strong>{' '}
                                            {product.condition}
                                        </p>
                                    </div>

                                    <div className="card-footer">
                                        <button
                                            onClick={() =>
                                                goToDetailsPage(product.id)
                                            }
                                            className="btn btn-primary w-100"
                                        >
                                            View More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    !loading && (
                        <div
                            className="no-results"
                            role="alert"
                        >
                            No products found. Please revise your filters.
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default SearchPage;

