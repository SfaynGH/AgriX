"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Loader2, Droplets, Power, PowerOff, RefreshCw } from "lucide-react"
import * as tf from '@tensorflow/tfjs'

// Plant disease classes
const CLASSES = [
  "Tomato_Bacterial_spot",
  "Tomato_Early_blight",
  "Tomato_Late_blight",
  "Tomato_Leaf_Mold",
  "Tomato_Septoria_leaf_spot",
  "Tomato__Target_Spot",
  "Tomato__Tomato_YellowLeaf__Curl_Virus",
  "Tomato_Spider_mites_Two_spotted_spider_mite",
  "Tomato__Tomato_mosaic_virus",
  "Tomato_healthy",
]

// Mock data for sensors
const SENSORS = [
  { id: 1, name: "Greenhouse Sensor 1", location: "Section A" },
  { id: 2, name: "Greenhouse Sensor 2", location: "Section B" },
  { id: 3, name: "Outdoor Sensor 1", location: "Field 1" },
  { id: 4, name: "Outdoor Sensor 2", location: "Field 2" },
]

interface MotorStatus {
  motor_on: boolean;
  soil_dry: boolean;
  soil_status: string;
  motor_status: string;
}

export default function PredictionPage() {
  const [cameraImages, setCameraImages] = useState<string[]>([])
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false)
  const [selectedSensor, setSelectedSensor] = useState<string>("")
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [isPredicting, setIsPredicting] = useState<boolean>(false)
  const [prediction, setPrediction] = useState<string | null>(null)
  const [advice, setAdvice] = useState<string | null>(null)
  const [needsIrrigation, setNeedsIrrigation] = useState<boolean>(false)
  const [model, setModel] = useState<tf.LayersModel | null>(null)
  const [modelLoaded, setModelLoaded] = useState<boolean>(false)
  
  // Motor control states
  const [motorStatus, setMotorStatus] = useState<MotorStatus | null>(null)
  const [isControllingMotor, setIsControllingMotor] = useState<boolean>(false)
  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(false)

  const showToast = (title: string, description: string, variant: "default" | "destructive" = "default") => {
    console.log(`${title}: ${description}`)
    // You can implement actual toast here if needed
  }

  // Load model from path - Replace this path with your model location
  const MODEL_PATH = 'public/model/model.json' // Change this to your model path

  // Load model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log("Loading model from:", MODEL_PATH)
        const loadedModel = await tf.loadLayersModel(MODEL_PATH)
        setModel(loadedModel)
        setModelLoaded(true)
        showToast("Success", "Local model loaded successfully!")
        console.log("Model loaded:", loadedModel)
      } catch (error) {
        console.error("Error loading model:", error)
        console.log("Model not found, will use API fallback")
        // Don't show error toast, just use API fallback
      }
    }

    loadModel()
    // Load initial motor status
    fetchMotorStatus()
    
    // Set up interval to check motor status every 30 seconds
    const statusInterval = setInterval(fetchMotorStatus, 30000)
    
    return () => clearInterval(statusInterval)
  }, [])

  // Fetch motor status
  const fetchMotorStatus = async () => {
    setIsLoadingStatus(true)
    try {
      const response = await fetch('https://monitor-plant.loca.lt/motor/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "bypass-tunnel-reminder": "true",
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch motor status')
      }
      
      const status = await response.json()
      setMotorStatus(status)
    } catch (error) {
      console.error("Failed to fetch motor status:", error)
      showToast("Error", "Failed to fetch motor status", "destructive")
    } finally {
      setIsLoadingStatus(false)
    }
  }

  // Control motor (turn on/off)
  const controlMotor = async (action: 'on' | 'off') => {
    setIsControllingMotor(true)
    try {
      const response = await fetch(`https://monitor-plant.loca.lt/motor/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "bypass-tunnel-reminder": "true",
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to turn motor ${action}`)
      }
      
      const result = await response.json()
      showToast("Success", result.message)
      
      // Refresh status after controlling motor
      await fetchMotorStatus()
    } catch (error) {
      console.error(`Failed to turn motor ${action}:`, error)
      showToast("Error", `Failed to turn motor ${action}`, "destructive")
    } finally {
      setIsControllingMotor(false)
    }
  }

  // Preprocess image for model prediction
  const preprocessImage = (imageElement: HTMLImageElement): tf.Tensor => {
    // Convert image to tensor and resize to model input size (typically 224x224 for most models)
    const tensor = tf.browser.fromPixels(imageElement)
      .resizeBilinear([224, 224]) // Adjust size based on your model's input requirements
      .expandDims(0) // Add batch dimension
      .div(255.0) // Normalize to [0, 1] - adjust based on your model's training
    
    return tensor
  }

  // Handle sensor selection
  const handleSensorSelect = (sensorId: string) => {
    setSelectedSensor(sensorId)
    setSelectedImage("")
    setPrediction(null)
    setAdvice(null)
    setCameraImages([])
  }

  const fetchCameraImage = async () => {
    if (!selectedSensor) {
      showToast("Error", "Please select a sensor first", "destructive")
      return
    }

    setIsLoadingImage(true)
    try {
      const response = await fetch('https://monitor-plant.loca.lt/image', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "bypass-tunnel-reminder": "true",
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch image')
      }
      
      const response_json = await response.json()
      const base64Image = response_json.image
    
      const imageDataUrl = base64Image.startsWith('data:') 
        ? base64Image 
        : `data:image/jpeg;base64,${base64Image}`
      
      setCameraImages(prev => {
        const newImages = [...prev, imageDataUrl]
        return newImages.slice(-3)
      })
      
      showToast("Success", "New camera image captured")
    } catch (error) {
      showToast("Error", "Failed to fetch camera image", "destructive")
    } finally {
      setIsLoadingImage(false)
    }
  }

  // Handle image selection
  const handleImageSelect = (image: string) => {
    setSelectedImage(image)
    setPrediction(null)
    setAdvice(null)
  }

  // Predict with local model
  const predictWithLocalModel = async (): Promise<string> => {
    if (!model || !selectedImage) {
      throw new Error("Model or image not available")
    }

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      
      img.onload = async () => {
        try {
          // Preprocess the image
          const preprocessed = preprocessImage(img)
          
          // Make prediction
          const prediction = model.predict(preprocessed) as tf.Tensor
          const predictions = await prediction.data()
          
          // Get the class with highest probability
          const maxIndex = predictions.indexOf(Math.max(...Array.from(predictions)))
          const predictedClass = CLASSES[maxIndex]
          
          // Clean up tensors
          preprocessed.dispose()
          prediction.dispose()
          
          resolve(predictedClass)
        } catch (error) {
          reject(error)
        }
      }
      
      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = selectedImage
    })
  }

  // Predict plant health (with fallback to API)
  const predictPlantHealth = async () => {
    if (!selectedSensor || !selectedImage) {
      showToast("Error", "Please select a sensor and an image first", "destructive")
      return
    }

    setIsPredicting(true)
    setPrediction(null)
    setAdvice(null)

    try {
      let predictedClass: string

      // Try local model first if available
      if (modelLoaded && model) {
        console.log("Using local model for prediction")
        predictedClass = await predictWithLocalModel()
      } else {
        console.log("Using API for prediction")
        // Fallback to API prediction
        const base64Image = selectedImage.startsWith('data:') 
          ? selectedImage.split(',')[1] 
          : selectedImage

        const response = await fetch('https://monitor-plant.loca.lt/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "bypass-tunnel-reminder": "true",
          },
          body: JSON.stringify({
            image: base64Image
          })
        })

        if (!response.ok) {
          throw new Error('Prediction failed')
        }

        const result = await response.json()
        predictedClass = result.prediction || result.class || result
      }
      
      setPrediction(predictedClass)
      generateAdvice(predictedClass)

      showToast("Success", `Plant health analysis completed using ${modelLoaded ? 'local model' : 'API'}`)
    } catch (error) {
      console.error("Prediction error:", error)
      showToast("Error", "Failed to analyze plant health", "destructive")
    } finally {
      setIsPredicting(false)
    }
  }

  // Generate advice based on prediction
  const generateAdvice = (predictedClass: string) => {
    let adviceText = ""
    let irrigation = false

    if (predictedClass === "Tomato_healthy") {
      adviceText = "Your tomato plant appears healthy! Continue with regular care and monitoring."
      irrigation = false
    } else if (predictedClass.includes("Bacterial_spot")) {
      adviceText = "Bacterial spot detected. Remove infected leaves, improve air circulation, and apply copper-based fungicide. Keep foliage dry when watering."
      irrigation = false
    } else if (predictedClass.includes("Early_blight")) {
      adviceText = "Early blight detected. Remove infected leaves, apply fungicide, and ensure proper spacing between plants for air circulation."
      irrigation = false
    } else if (predictedClass.includes("Late_blight")) {
      adviceText = "Late blight detected! This is serious. Remove infected plants immediately to prevent spread. Apply fungicide to remaining plants and ensure good drainage."
      irrigation = false
    } else if (predictedClass.includes("Leaf_Mold")) {
      adviceText = "Leaf mold detected. Improve air circulation, reduce humidity, and apply fungicide. Avoid overhead watering."
      irrigation = false
    } else if (predictedClass.includes("Septoria_leaf_spot")) {
      adviceText = "Septoria leaf spot detected. Remove infected leaves, apply fungicide, and avoid overhead watering. Mulch around plants to prevent soil splash."
      irrigation = false
    } else if (predictedClass.includes("Target_Spot")) {
      adviceText = "Target spot detected. Apply fungicide, remove infected leaves, and improve air circulation. Avoid overhead watering."
      irrigation = false
    } else if (predictedClass.includes("YellowLeaf__Curl_Virus")) {
      adviceText = "Tomato Yellow Leaf Curl Virus detected. This is spread by whiteflies. Remove infected plants, control whitefly population, and use reflective mulch."
      irrigation = false
    } else if (predictedClass.includes("Spider_mites")) {
      adviceText = "Spider mites detected. Spray plants with water to dislodge mites, apply insecticidal soap or neem oil. Increase humidity around plants."
      irrigation = true
    } else if (predictedClass.includes("mosaic_virus")) {
      adviceText = "Tomato mosaic virus detected. Remove and destroy infected plants. Disinfect tools and wash hands after handling. There is no cure for this virus."
      irrigation = false
    }

    setAdvice(adviceText)
    setNeedsIrrigation(irrigation)
  }

  // Handle irrigation (turn motor on)
  const handleIrrigation = async () => {
    await controlMotor('on')
    showToast("Irrigation Started", `Remote irrigation initiated for Sensor ${selectedSensor}`)
  }

  return (
    <section className="space-y-6 py-4">
      {/* Motor Control Card */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-600" />
            Irrigation System Control
          </CardTitle>
          <CardDescription>Monitor and control the irrigation motor</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Motor Status */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Motor Status:</span>
                <span className={`font-bold ${motorStatus?.motor_on ? 'text-green-600' : 'text-gray-600'}`}>
                  {motorStatus?.motor_status || 'Unknown'}
                </span>
                {motorStatus?.motor_on && (
                  <div className="flex items-center gap-1 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs">Active</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Soil Status:</span>
                <span className={`font-bold ${motorStatus?.soil_dry ? 'text-red-600' : 'text-green-600'}`}>
                  {motorStatus?.soil_status || 'Unknown'}
                </span>
              </div>
            </div>
            <Button
              onClick={fetchMotorStatus}
              disabled={isLoadingStatus}
              variant="outline"
              size="sm"
            >
              {isLoadingStatus ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Motor Control Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => controlMotor('on')}
              disabled={isControllingMotor || motorStatus?.motor_on}
              className="flex-1"
              variant={motorStatus?.motor_on ? "secondary" : "default"}
            >
              {isControllingMotor ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Power className="mr-2 h-4 w-4" />
              )}
              Turn Motor ON
            </Button>
            <Button
              onClick={() => controlMotor('off')}
              disabled={isControllingMotor || !motorStatus?.motor_on}
              className="flex-1"
              variant={!motorStatus?.motor_on ? "secondary" : "destructive"}
            >
              {isControllingMotor ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PowerOff className="mr-2 h-4 w-4" />
              )}
              Turn Motor OFF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Plant Health Analysis Card */}
      <Card>
        <CardHeader>
          <CardDescription>Select a sensor, view camera images, and analyze plant health</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sensor Selection */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Select Sensor</h3>
            <Select value={selectedSensor} onValueChange={handleSensorSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a sensor" />
              </SelectTrigger>
              <SelectContent>
                {SENSORS.map((sensor) => (
                  <SelectItem key={sensor.id} value={sensor.id.toString()}>
                    {sensor.name} ({sensor.location})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Camera Images */}
          {selectedSensor && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Camera Images</h3>
                <Button 
                  onClick={fetchCameraImage} 
                  disabled={isLoadingImage}
                  variant="outline"
                  size="sm"
                >
                  {isLoadingImage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Capturing...
                    </>
                  ) : (
                    "Capture New Image"
                  )}
                </Button>
              </div>
              
              {cameraImages.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {cameraImages.map((image, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer border-2 rounded-md overflow-hidden ${selectedImage === image ? "border-green-500" : "border-transparent"}`}
                      onClick={() => handleImageSelect(image)}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Camera image ${index + 1}`}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No images captured yet. Click "Capture New Image" to start.</p>
              )}
            </div>
          )}

          {/* Prediction Button */}
          {selectedSensor && selectedImage && (
            <Button onClick={predictPlantHealth} className="w-full" disabled={isPredicting}>
              {isPredicting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Plant Health...
                </>
              ) : (
                `Analyze Plant Health ${modelLoaded ? '(Local Model)' : '(API)'}`
              )}
            </Button>
          )}

          {/* Prediction Results */}
          {prediction && (
            <div className="mt-4 space-y-4">
              <Separator />
              <div>
                <h3 className="text-sm font-medium">Prediction Result</h3>
                <p
                  className={`text-lg font-bold ${prediction === "Tomato_healthy" ? "text-green-500" : "text-red-500"}`}
                >
                  {prediction.replace(/_/g, " ")}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Predicted using: {modelLoaded ? 'Local Model' : 'API'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chatbot Advice */}
      {advice && (
        <Card className="bg-slate-50 dark:bg-slate-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Plant Health Advisor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
              <p>{advice}</p>
            </div>
          </CardContent>
          <CardFooter>
            {needsIrrigation && (
              <Button onClick={handleIrrigation} className="w-full" disabled={isControllingMotor}>
                {isControllingMotor ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Droplets className="mr-2 h-4 w-4" />
                )}
                Start Remote Irrigation
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </section>
  )
}