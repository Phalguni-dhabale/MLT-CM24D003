import cv2
import mediapipe as mp

def main():
    # Initialize MediaPipe Pose Detection
    # MediaPipe uses BlazePose, which is a highly optimized, modern alternative to PoseNet
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose(
        static_image_mode=False,
        model_complexity=1,
        smooth_landmarks=True,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )
    mp_draw = mp.solutions.drawing_utils

    # Open default webcam
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    print("Starting Pose Detection. Press 'q' to quit.")

    while True:
        success, img = cap.read()
        if not success:
            print("Failed to grab frame.")
            break

        # Convert the BGR image to RGB as MediaPipe requires RGB
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Process the image and perform pose detection
        results = pose.process(img_rgb)

        # Draw the pose landmarks on the original BGR image
        if results.pose_landmarks:
            mp_draw.draw_landmarks(
                img, 
                results.pose_landmarks, 
                mp_pose.POSE_CONNECTIONS,
                mp_draw.DrawingSpec(color=(245, 117, 66), thickness=2, circle_radius=2),
                mp_draw.DrawingSpec(color=(245, 66, 230), thickness=2, circle_radius=2)
            )
            
            # Optional: Extract specific landmarks (e.g., nose)
            # nose_landmark = results.pose_landmarks.landmark[mp_pose.PoseLandmark.NOSE]
            # print(f"Nose coordinates: (X: {nose_landmark.x}, Y: {nose_landmark.y})")

        # Calculate and display FPS (optional, omitted for simplicity)
        
        # Show the processed image
        cv2.imshow("Pose Detection (Press 'q' to exit)", img)

        # Break the loop if 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release resources
    cap.release()
    cv2.destroyAllWindows()
    pose.close()

if __name__ == "__main__":
    main()
