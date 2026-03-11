import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import calorieService from '../services/calorieService';
import Loader from '../components/common/Loader';
import './Calories.css';

const Calories = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const videoRef     = useRef(null);
  const canvasRef    = useRef(null);

  // ── Tab ─────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('scan');

  // ── Loading & Messages ───────────────────────────────────────────
  const [isLoading,   setIsLoading]   = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState('');

  // ── Camera ───────────────────────────────────────────────────────
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError,  setCameraError]  = useState('');
  const [facingMode,   setFacingMode]   = useState('environment');
  const [stream,       setStream]       = useState(null);

  // ── Food Detection ───────────────────────────────────────────────
  const [selectedImage,   setSelectedImage]   = useState(null);
  const [imagePreview,    setImagePreview]     = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [nutritionData,   setNutritionData]   = useState(null);

  // ── Daily Data ───────────────────────────────────────────────────
  const [dailyProgress, setDailyProgress] = useState(null);
  const [meals,         setMeals]         = useState([]);
  const [goals,         setGoals]         = useState(null);

  // ── Water ────────────────────────────────────────────────────────
  const [waterAmount, setWaterAmount] = useState(250);

  // ── Goals Form ───────────────────────────────────────────────────
  const [goalForm, setGoalForm] = useState({
    goal_type:      'maintenance',
    activity_level: 'moderate',
    target_weight:  ''
  });

  // ── Manual Entry ─────────────────────────────────────────────────
  const [manualFood,         setManualFood]         = useState('');
  const [manualSearchResult, setManualSearchResult] = useState(null);

  // ════════════════════════════════════════════════════════════════
  // DATA LOADING
  // ════════════════════════════════════════════════════════════════

  const loadDailyData = async () => {
    setPageLoading(true);
    try {
      const [progressData, mealsData, goalsData] = await Promise.all([
        calorieService.getDailyProgress().catch(() => null),
        calorieService.getMeals().catch(() => []),
        calorieService.getGoals().catch(() => null),
      ]);

      setDailyProgress(progressData);
      setMeals(mealsData || []);
      setGoals(goalsData);

      if (goalsData) {
        setGoalForm({
          goal_type:      goalsData.goal_type      || 'maintenance',
          activity_level: goalsData.activity_level || 'moderate',
          target_weight:  goalsData.target_weight  || ''
        });
      }
    } catch (err) {
      console.error('Error loading daily data:', err);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadDailyData();
  }, []);

  // Auto-clear messages after 5s
  useEffect(() => {
    if (!error && !success) return;
    const timer = setTimeout(() => { setError(''); setSuccess(''); }, 5000);
    return () => clearTimeout(timer);
  }, [error, success]);

  // ════════════════════════════════════════════════════════════════
  // CAMERA
  // ════════════════════════════════════════════════════════════════

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  }, [stream]);

  // Stop camera when leaving scan tab or unmounting
  useEffect(() => {
    if (activeTab !== 'scan') stopCamera();
  }, [activeTab, stopCamera]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const startCamera = async () => {
    setCameraError('');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width:  { ideal: 1280 },
          height: { ideal: 720 },
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      setStream(mediaStream);
      setCameraActive(true);
    } catch (err) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError') {
        setCameraError('Camera permission denied. Please allow camera access.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else {
        setCameraError('Could not start camera: ' + err.message);
      }
    }
  };

  const flipCamera = async () => {
    stopCamera();
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
    setTimeout(() => startCamera(), 300);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video  = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file       = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
      const previewUrl = canvas.toDataURL('image/jpeg');

      setSelectedImage(file);
      setImagePreview(previewUrl);
      setDetectionResult(null);
      setNutritionData(null);

      stopCamera();
    }, 'image/jpeg', 0.9);
  };

  // ════════════════════════════════════════════════════════════════
  // IMAGE UPLOAD
  // ════════════════════════════════════════════════════════════════

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setDetectionResult(null);
    setNutritionData(null);
    setError('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setDetectionResult(null);
      setNutritionData(null);
    }
  };

  const clearImage = (e) => {
    e.stopPropagation();
    setSelectedImage(null);
    setImagePreview(null);
    setDetectionResult(null);
    setNutritionData(null);
  };

  // ════════════════════════════════════════════════════════════════
  // FOOD ANALYSIS
  // ════════════════════════════════════════════════════════════════

  const handleAnalyzeFood = async () => {
    if (!selectedImage) {
      setError('Please select or capture an image first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await calorieService.quickAnalyze(selectedImage);

      if (result.success) {
        setDetectionResult({
          detected_food: result.detected_food,
          confidence:    result.confidence,
          all_detected:  result.all_detected || []
        });
        setNutritionData({
          foods:          result.nutrition      || [],
          total_calories: result.total_calories || 0,
          total_protein:  result.total_protein  || 0,
          total_carbs:    result.total_carbs    || 0,
          total_fat:      result.total_fat      || 0
        });
        setSuccess('Food detected successfully!');
      } else {
        setError(result.error || 'Could not detect food in image');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ════════════════════════════════════════════════════════════════
  // MANUAL SEARCH
  // ════════════════════════════════════════════════════════════════

  const handleManualSearch = async () => {
    if (!manualFood.trim()) {
      setError('Please enter a food name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await calorieService.getNutrition(manualFood);
      if (result.foods && result.foods.length > 0) {
        setManualSearchResult({
          foods:          result.foods,
          total_calories: result.total_calories,
          total_protein:  result.total_protein,
          total_carbs:    result.total_carbs,
          total_fat:      result.total_fat
        });
        setSuccess('Food found!');
      } else {
        setError('Food not found. Try a different name.');
      }
    } catch (err) {
      setError('Failed to search food');
    } finally {
      setIsLoading(false);
    }
  };

  // ════════════════════════════════════════════════════════════════
  // MEAL LOGGING
  // ════════════════════════════════════════════════════════════════

  const handleLogMeal = async (mealType, source = 'detection') => {
    const data = source === 'detection' ? nutritionData : manualSearchResult;

    if (!data || data.foods.length === 0) {
      setError('No nutrition data to log');
      return;
    }

    setIsLoading(true);
    try {
      const food = data.foods[0];
      await calorieService.logMeal({
        meal_type:    mealType,
        food_name:    food.food_name || (source === 'detection'
                        ? detectionResult?.detected_food
                        : manualFood),
        serving_size: food.serving_size || '1 serving',
        quantity:     1,
        calories:     food.calories || 0,
        protein:      food.protein  || 0,
        carbs:        food.carbs    || 0,
        fat:          food.fat      || 0,
        fiber:        food.fiber    || 0,
        sugar:        food.sugar    || 0,
        sodium:       food.sodium   || 0,
        ai_detected:  source === 'detection' ? detectionResult?.detected_food : null,
        confidence:   source === 'detection' ? detectionResult?.confidence    : null,
      });

      // Reset state
      if (source === 'detection') {
        setSelectedImage(null);
        setImagePreview(null);
        setDetectionResult(null);
        setNutritionData(null);
      } else {
        setManualFood('');
        setManualSearchResult(null);
      }

      setSuccess(`Meal logged as ${mealType}! 🎉`);
      await loadDailyData();
      setActiveTab('progress');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to log meal');
    } finally {
      setIsLoading(false);
    }
  };

  // ════════════════════════════════════════════════════════════════
  // WATER
  // ════════════════════════════════════════════════════════════════

  const handleLogWater = async () => {
    setIsLoading(true);
    try {
      await calorieService.logWater(waterAmount);
      setSuccess(`Added ${waterAmount}ml of water! 💧`);
      await loadDailyData();
    } catch (err) {
      setError('Failed to log water');
    } finally {
      setIsLoading(false);
    }
  };

  // ════════════════════════════════════════════════════════════════
  // DELETE MEAL
  // ════════════════════════════════════════════════════════════════

  const handleDeleteMeal = async (mealId) => {
    if (!window.confirm('Delete this meal?')) return;
    try {
      await calorieService.deleteMeal(mealId);
      setSuccess('Meal deleted');
      await loadDailyData();
    } catch (err) {
      setError('Failed to delete meal');
    }
  };

  // ════════════════════════════════════════════════════════════════
  // GOALS
  // ════════════════════════════════════════════════════════════════

  const handleUpdateGoals = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await calorieService.createGoal({
        goal_type:      goalForm.goal_type,
        activity_level: goalForm.activity_level,
        target_weight:  goalForm.target_weight
                          ? parseFloat(goalForm.target_weight)
                          : null,
      });
      setSuccess('Goals updated successfully! 🎯');
      await loadDailyData();
      setActiveTab('progress');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update goals');
    } finally {
      setIsLoading(false);
    }
  };

  // ════════════════════════════════════════════════════════════════
  // HELPERS
  // ════════════════════════════════════════════════════════════════

  const getProgressPercentage = (consumed, target) => {
    if (!target || target === 0) return 0;
    return Math.min(100, Math.round((consumed / target) * 100));
  };

  const getProgressColor = (pct) => {
    if (pct < 50)  return '#22c55e';
    if (pct < 80)  return '#f59e0b';
    if (pct < 100) return '#f97316';
    return '#ef4444';
  };

  // ════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════

  if (pageLoading) return <Loader />;

  return (
    <div className="calories-page">
      <div className="calories-container">

        {/* ── Header ── */}
        <div className="calories-header">
          <h1>🍎 AI Calorie Detection</h1>
          <p>Scan or photograph your food for instant nutrition info</p>
        </div>

        {/* ── Tabs ── */}
        <div className="calories-tabs">
          {[
            { id: 'scan',     icon: '📷', label: 'Scan Food'  },
            { id: 'manual',   icon: '✏️', label: 'Manual'     },
            { id: 'progress', icon: '📊', label: 'Progress'   },
            { id: 'meals',    icon: '🍽️', label: 'Meals'      },
            { id: 'goals',    icon: '🎯', label: 'Goals'      },
          ].map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-text">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Messages ── */}
        {error && (
          <div className="message error-message">
            <span>⚠️ {error}</span>
            <button onClick={() => setError('')}>×</button>
          </div>
        )}
        {success && (
          <div className="message success-message">
            <span>✅ {success}</span>
            <button onClick={() => setSuccess('')}>×</button>
          </div>
        )}

        {/* ── Tab Content ── */}
        <div className="tab-content">

          {/* ══════════════════════════════════════════
              SCAN TAB
          ══════════════════════════════════════════ */}
          {activeTab === 'scan' && (
            <div className="scan-section">

              {/* Mode Toggle */}
              <div className="scan-mode-toggle">
                <button
                  className={`mode-btn ${!cameraActive ? 'active' : ''}`}
                  onClick={stopCamera}
                >
                  📁 Upload Photo
                </button>
                <button
                  className={`mode-btn ${cameraActive ? 'active' : ''}`}
                  onClick={startCamera}
                >
                  📷 Use Camera
                </button>
              </div>

              {/* Camera Error */}
              {cameraError && (
                <div className="message error-message">
                  <span>⚠️ {cameraError}</span>
                  <button onClick={() => setCameraError('')}>×</button>
                </div>
              )}

              {/* Live Camera */}
              {cameraActive && (
                <div className="camera-container">
                  <video
                    ref={videoRef}
                    className="camera-feed"
                    autoPlay
                    playsInline
                    muted
                  />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />

                  <p className="camera-hint">
                    Point camera at food and press Capture
                  </p>

                  <div className="camera-controls">
                    <button className="camera-btn flip-btn"    onClick={flipCamera}>
                      🔄 Flip
                    </button>
                    <button className="camera-btn capture-btn" onClick={capturePhoto}>
                      📸 Capture
                    </button>
                    <button className="camera-btn close-btn"   onClick={stopCamera}>
                      ✕ Close
                    </button>
                  </div>
                </div>
              )}

              {/* File Upload */}
              {!cameraActive && (
                <div
                  className="upload-area"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {imagePreview ? (
                    <div className="preview-container">
                      <img
                        src={imagePreview}
                        alt="Food preview"
                        className="preview-image"
                      />
                      <button className="clear-image-btn" onClick={clearImage}>
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <span className="upload-icon">📷</span>
                      <p>Click to upload food image</p>
                      <span className="upload-hint">or drag and drop here</span>
                      <span className="upload-formats">
                        JPG, PNG, WEBP — max 10MB
                      </span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    hidden
                  />
                </div>
              )}

              {/* Analyze Button */}
              {selectedImage && !detectionResult && (
                <button
                  className="analyze-btn"
                  onClick={handleAnalyzeFood}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><span className="btn-spinner" /> Analyzing...</>
                  ) : (
                    <><span>🔍</span> Analyze Food</>
                  )}
                </button>
              )}

              {/* Detection Results */}
              {detectionResult && (
                <div className="detection-results">
                  <h3>🎯 Detected Food</h3>
                  <div className="detected-food-card">
                    <div className="food-info">
                      <span className="food-name">
                        {detectionResult.detected_food}
                      </span>
                      <span className="food-serving">
                        {nutritionData?.foods?.[0]?.serving_size || '1 serving'}
                      </span>
                    </div>
                    <span className={`confidence ${
                      detectionResult.confidence >= 80 ? 'high'
                      : detectionResult.confidence >= 50 ? 'medium'
                      : 'low'
                    }`}>
                      {Math.round(detectionResult.confidence)}% confident
                    </span>
                  </div>

                  {detectionResult.all_detected?.length > 1 && (
                    <div className="other-detected">
                      <p>Other possibilities:</p>
                      <div className="food-tags">
                        {detectionResult.all_detected.slice(1, 4).map((food, idx) => (
                          <span key={idx} className="food-tag">
                            {food.name} ({Math.round(food.confidence)}%)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Nutrition Results */}
              {nutritionData && (
                <div className="nutrition-results">
                  <h3>📊 Nutrition Information</h3>
                  <div className="nutrition-grid">
                    <div className="nutrition-card calories">
                      <span className="nutrition-icon">🔥</span>
                      <span className="nutrition-value">
                        {Math.round(nutritionData.total_calories)}
                      </span>
                      <span className="nutrition-label">Calories</span>
                    </div>
                    <div className="nutrition-card protein">
                      <span className="nutrition-icon">🥩</span>
                      <span className="nutrition-value">
                        {Math.round(nutritionData.total_protein)}g
                      </span>
                      <span className="nutrition-label">Protein</span>
                    </div>
                    <div className="nutrition-card carbs">
                      <span className="nutrition-icon">🍞</span>
                      <span className="nutrition-value">
                        {Math.round(nutritionData.total_carbs)}g
                      </span>
                      <span className="nutrition-label">Carbs</span>
                    </div>
                    <div className="nutrition-card fat">
                      <span className="nutrition-icon">🥑</span>
                      <span className="nutrition-value">
                        {Math.round(nutritionData.total_fat)}g
                      </span>
                      <span className="nutrition-label">Fat</span>
                    </div>
                  </div>

                  {/* Log as Meal */}
                  <div className="log-meal-section">
                    <h4>Log this meal as:</h4>
                    <div className="meal-type-buttons">
                      {[
                        { type: 'breakfast', icon: '🌅' },
                        { type: 'lunch',     icon: '☀️' },
                        { type: 'dinner',    icon: '🌙' },
                        { type: 'snack',     icon: '🍿' },
                      ].map(({ type, icon }) => (
                        <button
                          key={type}
                          onClick={() => handleLogMeal(type, 'detection')}
                          disabled={isLoading}
                          className={`meal-btn ${type}`}
                        >
                          <span>{icon}</span>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════
              MANUAL ENTRY TAB
          ══════════════════════════════════════════ */}
          {activeTab === 'manual' && (
            <div className="manual-section">
              <h3>✏️ Manual Food Entry</h3>
              <p className="section-desc">
                Can't scan? Enter the food name manually
              </p>

              <div className="manual-search">
                <input
                  type="text"
                  placeholder="e.g., chicken biryani, apple, pizza"
                  value={manualFood}
                  onChange={(e) => setManualFood(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                />
                <button
                  onClick={handleManualSearch}
                  disabled={isLoading || !manualFood.trim()}
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </button>
              </div>

              {manualSearchResult && (
                <div className="nutrition-results">
                  <h3>📊 Nutrition Information</h3>
                  <div className="detected-food-card">
                    <div className="food-info">
                      <span className="food-name">
                        {manualSearchResult.foods[0]?.food_name || manualFood}
                      </span>
                      <span className="food-serving">
                        {manualSearchResult.foods[0]?.serving_size || '1 serving'}
                      </span>
                    </div>
                  </div>

                  <div className="nutrition-grid">
                    {[
                      { label: 'Calories', icon: '🔥', value: Math.round(manualSearchResult.total_calories),     unit: '',  cls: 'calories' },
                      { label: 'Protein',  icon: '🥩', value: Math.round(manualSearchResult.total_protein),      unit: 'g', cls: 'protein'  },
                      { label: 'Carbs',    icon: '🍞', value: Math.round(manualSearchResult.total_carbs),        unit: 'g', cls: 'carbs'    },
                      { label: 'Fat',      icon: '🥑', value: Math.round(manualSearchResult.total_fat),          unit: 'g', cls: 'fat'      },
                    ].map(n => (
                      <div key={n.label} className={`nutrition-card ${n.cls}`}>
                        <span className="nutrition-icon">{n.icon}</span>
                        <span className="nutrition-value">{n.value}{n.unit}</span>
                        <span className="nutrition-label">{n.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="log-meal-section">
                    <h4>Log this meal as:</h4>
                    <div className="meal-type-buttons">
                      {[
                        { type: 'breakfast', icon: '🌅' },
                        { type: 'lunch',     icon: '☀️' },
                        { type: 'dinner',    icon: '🌙' },
                        { type: 'snack',     icon: '🍿' },
                      ].map(({ type, icon }) => (
                        <button
                          key={type}
                          onClick={() => handleLogMeal(type, 'manual')}
                          disabled={isLoading}
                          className={`meal-btn ${type}`}
                        >
                          <span>{icon}</span>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Add */}
              <div className="quick-foods">
                <h4>Quick Add Common Foods</h4>
                <div className="quick-food-grid">
                  {['Rice','Roti','Dal','Chicken','Egg','Apple','Banana','Milk'].map(food => (
                    <button
                      key={food}
                      className="quick-food-btn"
                      onClick={() => {
                        setManualFood(food);
                        setTimeout(handleManualSearch, 0);
                      }}
                    >
                      {food}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════
              PROGRESS TAB
          ══════════════════════════════════════════ */}
          {activeTab === 'progress' && (
            <div className="progress-section">
              <div className="daily-summary">
                <h3> Today's Progress</h3>

                {dailyProgress ? (
                  <>
                    {/* Calorie Ring */}
                    <div className="calories-ring-container">
                      <div className="calories-ring">
                        <svg viewBox="0 0 100 100">
                          <circle
                            className="ring-bg"
                            cx="50" cy="50" r="42"
                            fill="none" strokeWidth="8"
                          />
                          <circle
                            className="ring-progress"
                            cx="50" cy="50" r="42"
                            fill="none" strokeWidth="8"
                            strokeLinecap="round"
                            style={{
                              strokeDasharray:  264,
                              strokeDashoffset: 264 - (264 * getProgressPercentage(
                                dailyProgress.intake?.total_calories || 0,
                                dailyProgress.goals?.daily_calories  || 2000
                              )) / 100,
                              stroke: getProgressColor(getProgressPercentage(
                                dailyProgress.intake?.total_calories || 0,
                                dailyProgress.goals?.daily_calories  || 2000
                              ))
                            }}
                          />
                        </svg>
                        <div className="ring-content">
                          <span className="consumed">
                            {Math.round(dailyProgress.intake?.total_calories || 0)}
                          </span>
                          <span className="target">
                            / {dailyProgress.goals?.daily_calories || 2000}
                          </span>
                          <span className="unit">kcal</span>
                        </div>
                      </div>
                      <p className={`remaining ${dailyProgress.calories_remaining < 0 ? 'over' : ''}`}>
                        {dailyProgress.calories_remaining > 0
                          ? `${Math.round(dailyProgress.calories_remaining)} calories remaining`
                          : `${Math.abs(Math.round(dailyProgress.calories_remaining))} calories over target`
                        }
                      </p>
                    </div>

                    {/* Macro Bars */}
                    <div className="macro-progress">
                      {[
                        {
                          label: ' Protein',
                          consumed: dailyProgress.intake?.total_protein || 0,
                          target:   dailyProgress.goals?.daily_protein  || 150,
                          cls: 'protein'
                        },
                        {
                          label: ' Carbs',
                          consumed: dailyProgress.intake?.total_carbs || 0,
                          target:   dailyProgress.goals?.daily_carbs  || 200,
                          cls: 'carbs'
                        },
                        {
                          label: ' Fat',
                          consumed: dailyProgress.intake?.total_fat || 0,
                          target:   dailyProgress.goals?.daily_fat  || 65,
                          cls: 'fat'
                        },
                      ].map(macro => (
                        <div key={macro.cls} className="macro-item">
                          <div className="macro-header">
                            <span className="macro-label">{macro.label}</span>
                            <span className="macro-values">
                              {Math.round(macro.consumed)}g / {macro.target}g
                            </span>
                          </div>
                          <div className="progress-bar">
                            <div
                              className={`progress ${macro.cls}`}
                              style={{
                                width: `${getProgressPercentage(macro.consumed, macro.target)}%`
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Water */}
                    <div className="water-tracking">
                      <div className="water-header">
                        <h4> Water Intake</h4>
                        <span className="water-total">
                          {((dailyProgress.intake?.water_intake || 0) * 1000).toFixed(0)}ml
                          {' '}/ {((dailyProgress.goals?.daily_water || 2.5) * 1000).toFixed(0)}ml
                        </span>
                      </div>
                      <div className="progress-bar water-bar">
                        <div
                          className="progress water"
                          style={{
                            width: `${getProgressPercentage(
                              dailyProgress.intake?.water_intake || 0,
                              dailyProgress.goals?.daily_water   || 2.5
                            )}%`
                          }}
                        />
                      </div>
                      <div className="water-input">
                        <div className="water-presets">
                          {[150, 250, 500, 750].map(amount => (
                            <button
                              key={amount}
                              className={`water-preset ${waterAmount === amount ? 'active' : ''}`}
                              onClick={() => setWaterAmount(amount)}
                            >
                              {amount}ml
                            </button>
                          ))}
                        </div>
                        <button
                          className="add-water-btn"
                          onClick={handleLogWater}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Adding...' : `+ Add ${waterAmount}ml`}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="no-data">
                    <span className="no-data-icon"></span>
                    <p>No data for today yet</p>
                    <button onClick={() => setActiveTab('scan')}>
                      Start tracking
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════
              MEALS TAB
          ══════════════════════════════════════════ */}
          {activeTab === 'meals' && (
            <div className="meals-section">
              <h3> Today's Meals</h3>

              {meals.length === 0 ? (
                <div className="empty-meals">
                  <span className="empty-icon"></span>
                  <p>No meals logged today</p>
                  <button onClick={() => setActiveTab('scan')}>
                    Log your first meal
                  </button>
                </div>
              ) : (
                <div className="meals-list">
                  {['breakfast','lunch','dinner','snack'].map(mealType => {
                    const typeMeals = meals.filter(m => m.meal_type === mealType);
                    if (!typeMeals.length) return null;

                    const icons = {
                      breakfast: '🌅', lunch: '☀️',
                      dinner: '🌙', snack: '🍿'
                    };

                    return (
                      <div key={mealType} className="meal-group">
                        <h4 className={`meal-group-title ${mealType}`}>
                          {icons[mealType]}{' '}
                          {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                        </h4>
                        {typeMeals.map(meal => (
                          <div key={meal.id} className="meal-card">
                            <div className="meal-info">
                              <h5>{meal.food_name}</h5>
                              {meal.ai_detected && (
                                <span className="ai-badge">
                                   AI ({Math.round(meal.confidence)}%)
                                </span>
                              )}
                              <div className="meal-macros">
                                <span className="macro cal">{Math.round(meal.calories)} cal</span>
                                <span className="macro pro">{Math.round(meal.protein)}g P</span>
                                <span className="macro carb">{Math.round(meal.carbs)}g C</span>
                                <span className="macro fat">{Math.round(meal.fat)}g F</span>
                              </div>
                            </div>
                            <button
                              className="delete-meal-btn"
                              onClick={() => handleDeleteMeal(meal.id)}
                              title="Delete meal"
                            >
                              🗑️
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })}

                  {/* Daily Totals */}
                  <div className="daily-totals">
                    <h4> Daily Totals</h4>
                    <div className="totals-grid">
                      {[
                        { label: 'Calories', value: meals.reduce((s,m) => s+(m.calories||0), 0).toFixed(0),  unit: ''  },
                        { label: 'Protein',  value: meals.reduce((s,m) => s+(m.protein ||0), 0).toFixed(0),  unit: 'g' },
                        { label: 'Carbs',    value: meals.reduce((s,m) => s+(m.carbs   ||0), 0).toFixed(0),  unit: 'g' },
                        { label: 'Fat',      value: meals.reduce((s,m) => s+(m.fat     ||0), 0).toFixed(0),  unit: 'g' },
                      ].map(t => (
                        <div key={t.label} className="total-item">
                          <span className="total-value">{t.value}{t.unit}</span>
                          <span className="total-label">{t.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════
              GOALS TAB
          ══════════════════════════════════════════ */}
          {activeTab === 'goals' && (
            <div className="goals-section">
              <h3> Nutrition Goals</h3>

              {goals && (
                <div className="current-goals">
                  <h4>Current Daily Targets</h4>
                  <div className="goals-grid">
                    {[
                      { icon: '', value: goals.daily_calories || 2000, label: 'Calories', unit: ''  },
                      { icon: '', value: goals.daily_protein  || 150,  label: 'Protein',  unit: 'g' },
                      { icon: '', value: goals.daily_carbs    || 200,  label: 'Carbs',    unit: 'g' },
                      { icon: '', value: goals.daily_fat      || 65,   label: 'Fat',      unit: 'g' },
                      { icon: '', value: goals.daily_water    || 2.5,  label: 'Water',    unit: 'L' },
                    ].map(g => (
                      <div key={g.label} className="goal-item">
                        <span className="goal-icon">{g.icon}</span>
                        <span className="goal-value">{g.value}{g.unit}</span>
                        <span className="goal-label">{g.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleUpdateGoals} className="goals-form">
                <h4>Update Your Goals</h4>

                <div className="form-group">
                  <label> Goal Type</label>
                  <select
                    value={goalForm.goal_type}
                    onChange={(e) => setGoalForm({ ...goalForm, goal_type: e.target.value })}
                  >
                    <option value="weight_loss"> Weight Loss (-500 cal/day)</option>
                    <option value="muscle_gain"> Muscle Gain (+300 cal/day)</option>
                    <option value="maintenance"> Maintenance</option>
                    <option value="keto"> Keto (Low Carb)</option>
                    <option value="high_protein"> High Protein</option>
                  </select>
                </div>

                <div className="form-group">
                  <label> Activity Level</label>
                  <select
                    value={goalForm.activity_level}
                    onChange={(e) => setGoalForm({ ...goalForm, activity_level: e.target.value })}
                  >
                    <option value="sedentary"> Sedentary</option>
                    <option value="light"> Light (1-3 days/week)</option>
                    <option value="moderate"> Moderate (3-5 days/week)</option>
                    <option value="active"> Active (6-7 days/week)</option>
                    <option value="very_active"> Very Active (2x/day)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label> Target Weight (kg) — Optional</label>
                  <input
                    type="number"
                    placeholder="e.g., 70"
                    value={goalForm.target_weight}
                    onChange={(e) => setGoalForm({ ...goalForm, target_weight: e.target.value })}
                    min="30"
                    max="300"
                  />
                  <span className="form-hint">
                    Leave empty to calculate from current profile weight
                  </span>
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? (
                    <><span className="btn-spinner" /> Updating...</>
                  ) : (
                    'Update Goals'
                  )}
                </button>
              </form>

              <div className="goal-tips">
                <h4> Tips</h4>
                <ul>
                  <li>Aim for 0.5–1 kg/week weight loss (500 cal deficit)</li>
                  <li>Protein preserves muscle during weight loss</li>
                  <li>Drink water before meals to feel fuller</li>
                  <li>Update goals as your body changes</li>
                </ul>
              </div>
            </div>
          )}

        </div>{/* end tab-content */}
      </div>
    </div>
  );
};

export default Calories;