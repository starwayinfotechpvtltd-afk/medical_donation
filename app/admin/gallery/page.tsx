'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import {
  ImageIcon,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Upload,
  Layers,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  Search,
  Eye,
  Filter,
} from 'lucide-react';
import {
  galleryApi,
  getMediaUrl,
  type GalleryCategory,
  type GalleryMedia,
} from '@/lib/gallery-api';

export default function AdminGalleryPage() {
  const [activeTab, setActiveTab] = useState<'categories' | 'media'>('categories');
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Selected category for Media Tab
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [categoryMedia, setCategoryMedia] = useState<GalleryMedia[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);

  // Category Modal State
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<GalleryCategory | null>(null);
  const [catForm, setCatForm] = useState({
    name: '',
    slug: '',
    description: '',
    sort_order: 0,
    is_active: true,
  });
  const [catSaving, setCatSaving] = useState(false);

  // Upload State
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search/Filter State
  const [searchQuery, setSearchQuery] = useState('');

  // ── Load All Categories ──────────────────────────────────────────────────
  const loadCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await galleryApi.adminGetCategories();
      setCategories(data);
      if (data.length > 0 && !selectedCatId) {
        setSelectedCatId(data[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load gallery categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // ── Load Media when Selected Category Changes ───────────────────────────
  const loadCategoryMedia = async (catId: number) => {
    try {
      setMediaLoading(true);
      const res = await galleryApi.adminGetCategory(catId);
      setCategoryMedia(res.media);
    } catch (err: any) {
      setError(err.message || 'Failed to load category media.');
    } finally {
      setMediaLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCatId) {
      loadCategoryMedia(selectedCatId);
    }
  }, [selectedCatId]);

  // ── Category Modal Handlers ──────────────────────────────────────────────
  const openCreateCatModal = () => {
    setEditingCategory(null);
    setCatForm({
      name: '',
      slug: '',
      description: '',
      sort_order: categories.length + 1,
      is_active: true,
    });
    setShowCatModal(true);
  };

  const openEditCatModal = (cat: GalleryCategory) => {
    setEditingCategory(cat);
    setCatForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      sort_order: cat.sort_order ?? 0,
      is_active: Boolean(cat.is_active),
    });
    setShowCatModal(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name.trim()) return;

    try {
      setCatSaving(true);
      setError('');

      if (editingCategory) {
        await galleryApi.adminUpdateCategory(editingCategory.id, catForm);
        setSuccessMsg('Category updated successfully!');
      } else {
        await galleryApi.adminCreateCategory(catForm);
        setSuccessMsg('Category created successfully!');
      }

      setShowCatModal(false);
      await loadCategories();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to save category.');
    } finally {
      setCatSaving(false);
    }
  };

  const handleDeleteCategory = async (cat: GalleryCategory) => {
    if (
      !confirm(
        `Are you sure you want to delete "${cat.name}"?\nAll photos inside this category will also be permanently deleted.`
      )
    ) {
      return;
    }

    try {
      setError('');
      await galleryApi.adminDeleteCategory(cat.id);
      setSuccessMsg(`Category "${cat.name}" deleted.`);
      if (selectedCatId === cat.id) {
        setSelectedCatId(null);
      }
      await loadCategories();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete category.');
    }
  };

  // ── Upload Handlers ──────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);

      // Create blob previews
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setFilePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadPhotos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatId) {
      setError('Please select a category to upload to.');
      return;
    }

    if (selectedFiles.length === 0 && !uploadUrl.trim()) {
      setError('Please choose at least one image file or provide an image URL.');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const formData = new FormData();
      formData.append('category_id', String(selectedCatId));
      if (uploadTitle) formData.append('title', uploadTitle);

      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append('files', file);
        });
      } else if (uploadUrl) {
        formData.append('url', uploadUrl.trim());
      }

      await galleryApi.adminUploadMedia(formData);

      setSuccessMsg('Photos uploaded successfully!');
      setSelectedFiles([]);
      setFilePreviews([]);
      setUploadUrl('');
      setUploadTitle('');
      if (fileInputRef.current) fileInputRef.current.value = '';

      await loadCategoryMedia(selectedCatId);
      await loadCategories();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload photos.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (mediaId: number) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      setError('');
      await galleryApi.adminDeleteMedia(mediaId);
      setSuccessMsg('Photo deleted successfully.');
      if (selectedCatId) {
        await loadCategoryMedia(selectedCatId);
        await loadCategories();
      }
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete photo.');
    }
  };

  const selectedCategory = categories.find((c) => c.id === selectedCatId);

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8">
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Hospital Gallery Management
              </h1>
              <p className="text-sm text-slate-500">
                Create and organize photo albums, categories, and upload hospital visual assets
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={loadCategories}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={openCreateCatModal}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
          >
            <Plus className="h-4 w-4" />
            New Category
          </button>
        </div>
      </div>

      {/* ── ALERTS / TOASTS ─────────────────────────────────────── */}
      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-600 hover:text-emerald-800">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── TABS NAVIGATION ─────────────────────────────────────── */}
      <div className="mb-6 flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-semibold transition ${
            activeTab === 'categories'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Layers className="h-4 w-4" />
          Album Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-semibold transition ${
            activeTab === 'media'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Upload className="h-4 w-4" />
          Upload & Manage Photos
        </button>
      </div>

      {/* ── TAB 1: CATEGORIES LIST ──────────────────────────────── */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-9 pr-3 py-1.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Total {categories.length} Categories
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400">Loading categories...</div>
            ) : categories.length === 0 ? (
              <div className="p-12 text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <p className="font-semibold text-slate-700">No categories created yet</p>
                <p className="text-sm text-slate-400 mt-1">
                  Create your first gallery category to start adding photos.
                </p>
                <button
                  onClick={openCreateCatModal}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  <Plus className="h-4 w-4" /> Create Category
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">URL Slug</th>
                      <th className="px-6 py-4 text-center">Sort Order</th>
                      <th className="px-6 py-4 text-center">Photos</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {categories
                      .filter((c) =>
                        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        c.slug.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((cat) => (
                        <tr key={cat.id} className="hover:bg-slate-50/50 transition">
                          {/* Name & Preview */}
                          <td className="px-6 py-4 font-semibold text-slate-900">
                            <div className="flex items-center gap-3">
                              <div className="relative h-10 w-14 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                {cat.covers && cat.covers.length > 0 ? (
                                  <Image
                                    src={getMediaUrl(cat.covers[0])}
                                    alt={cat.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-slate-300">
                                    <ImageIcon className="h-5 w-5" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-slate-800">{cat.name}</p>
                                {cat.description && (
                                  <p className="text-xs text-slate-400 font-normal line-clamp-1 max-w-sm">
                                    {cat.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Slug */}
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">
                            /gallery/{cat.slug}
                          </td>

                          {/* Sort Order */}
                          <td className="px-6 py-4 text-center font-semibold text-slate-700">
                            {cat.sort_order ?? 0}
                          </td>

                          {/* Media Count */}
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                              {cat.media_count || 0} Photos
                            </span>
                          </td>

                          {/* Active Status */}
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                cat.is_active
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {cat.is_active ? 'Active' : 'Disabled'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setSelectedCatId(cat.id);
                                setActiveTab('media');
                              }}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 transition"
                              title="Upload and manage photos in this category"
                            >
                              <Upload className="h-3.5 w-3.5" />
                              Manage Photos
                            </button>
                            <button
                              onClick={() => openEditCatModal(cat)}
                              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                              title="Edit Category"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat)}
                              className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                              title="Delete Category"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: UPLOAD & MANAGE MEDIA ────────────────────────── */}
      {activeTab === 'media' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Category Selector & Upload Box */}
          <div className="lg:col-span-4 space-y-6">
            {/* Category Selector Card */}
            <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Select Target Category
              </label>
              <select
                value={selectedCatId || ''}
                onChange={(e) => setSelectedCatId(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.media_count || 0} photos)
                  </option>
                ))}
              </select>

              {selectedCategory && (
                <div className="pt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-100">
                  <span>Slug: /gallery/{selectedCategory.slug}</span>
                  <a
                    href={`/gallery/${selectedCategory.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    View Page <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Upload Box Form */}
            <form
              onSubmit={handleUploadPhotos}
              className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-4"
            >
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                2. Upload New Photos
              </label>

              {/* Title / Caption Input */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Photo Title / Caption (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Modern Laparoscopy Unit"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Drag and Drop / File Input Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20 rounded-2xl p-6 text-center transition flex flex-col items-center justify-center bg-slate-50/60"
              >
                <Upload className="h-8 w-8 text-emerald-600 mb-2" />
                <p className="text-sm font-semibold text-slate-700">
                  Click to select photo files
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Supports JPG, PNG, WEBP (multiple files allowed)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Selected Files Previews */}
              {filePreviews.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-600">
                    Selected Files ({selectedFiles.length}):
                  </p>
                  <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-100">
                    {filePreviews.map((preview, idx) => (
                      <div
                        key={idx}
                        className="relative h-16 rounded-lg overflow-hidden border border-slate-200 group"
                      >
                        <Image
                          src={preview}
                          alt="preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeSelectedFile(idx)}
                          className="absolute top-1 right-1 h-5 w-5 bg-red-600 text-white rounded-full flex items-center justify-center shadow opacity-90 hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Or Paste Direct URL */}
              <div className="pt-2 border-t border-slate-100">
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Or Paste External Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Submit Upload Button */}
              <button
                type="submit"
                disabled={uploading || (!selectedFiles.length && !uploadUrl)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-50 disabled:pointer-events-none transition"
              >
                <Upload className="h-4 w-4" />
                {uploading
                  ? 'Uploading...'
                  : selectedFiles.length > 1
                  ? `Upload ${selectedFiles.length} Photos`
                  : 'Upload Photo'}
              </button>
            </form>
          </div>

          {/* Right Column: Photos Grid for Selected Category */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {selectedCategory ? selectedCategory.name : 'Category'} Album
                  </h2>
                  <p className="text-xs text-slate-400">
                    {categoryMedia.length}{' '}
                    {categoryMedia.length === 1 ? 'photo in album' : 'photos in album'}
                  </p>
                </div>

                {selectedCategory && (
                  <a
                    href={`/gallery/${selectedCategory.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-xl transition"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview Live Album
                  </a>
                )}
              </div>

              {mediaLoading ? (
                <div className="py-20 text-center text-slate-400">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-emerald-600" />
                  Loading photos...
                </div>
              ) : categoryMedia.length === 0 ? (
                <div className="py-20 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-700">No photos in this category yet</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Use the upload panel on the left to add photos to this album.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {categoryMedia.map((item) => (
                    <div
                      key={item.id}
                      className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm"
                    >
                      {/* Photo Thumbnail */}
                      <div className="relative h-44 w-full">
                        <Image
                          src={getMediaUrl(item.url)}
                          alt={item.title || 'Photo'}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Actions overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                          <button
                            onClick={() => handleDeleteMedia(item.id)}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 transition"
                            title="Delete photo"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Title Tag */}
                      <div className="p-2.5 bg-white border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {item.title || 'Untitled Photo'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE / EDIT CATEGORY MODAL ────────────────────────── */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingCategory ? 'Edit Gallery Category' : 'Create New Gallery Category'}
              </h3>
              <button
                onClick={() => setShowCatModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              {/* Category Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operation Theatres & ICU"
                  value={catForm.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setCatForm((prev) => ({
                      ...prev,
                      name,
                      slug: editingCategory
                        ? prev.slug
                        : name
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-|-$/g, ''),
                    }));
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* URL Slug */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="operation-theatres-icu"
                  value={catForm.slug}
                  onChange={(e) => setCatForm((prev) => ({ ...prev, slug: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-mono text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Will be accessible at: /gallery/{catForm.slug || 'slug'}
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Short description about the department or facilities shown in this album..."
                  value={catForm.description}
                  onChange={(e) =>
                    setCatForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Sort Order & Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={catForm.sort_order}
                    onChange={(e) =>
                      setCatForm((prev) => ({ ...prev, sort_order: Number(e.target.value) }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="is_active_check"
                    checked={catForm.is_active}
                    onChange={(e) =>
                      setCatForm((prev) => ({ ...prev, is_active: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="is_active_check" className="text-sm font-semibold text-slate-700">
                    Active & Visible
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={catSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-50 transition"
                >
                  {catSaving ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
