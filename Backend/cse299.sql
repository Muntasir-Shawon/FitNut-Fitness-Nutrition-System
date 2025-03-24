-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 24, 2025 at 09:11 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cse299`
--

-- --------------------------------------------------------

--
-- Table structure for table `achievements`
--

CREATE TABLE `achievements` (
  `achievement_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `date_achieved` timestamp NOT NULL DEFAULT current_timestamp(),
  `milestone_value` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `achievements`
--

INSERT INTO `achievements` (`achievement_id`, `user_id`, `name`, `description`, `date_achieved`, `milestone_value`) VALUES
(1, 1, 'First Mile', 'Completed first mile run', '2025-03-24 07:31:18', 1),
(2, 2, 'Weight Loss', 'Lost first 5kg', '2025-03-24 07:31:18', 5),
(3, 3, 'Workout Streak', 'Completed 30 days streak', '2025-03-24 07:31:18', 30);

-- --------------------------------------------------------

--
-- Table structure for table `exercises`
--

CREATE TABLE `exercises` (
  `exercise_id` int(11) NOT NULL,
  `workout_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `sets` int(11) DEFAULT NULL,
  `reps` int(11) DEFAULT NULL,
  `rest_period_seconds` int(11) DEFAULT NULL,
  `tips` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exercises`
--

INSERT INTO `exercises` (`exercise_id`, `workout_id`, `name`, `description`, `sets`, `reps`, `rest_period_seconds`, `tips`, `image_url`) VALUES
(1, 1, 'Push-ups', 'Classic chest exercise', 3, 15, 60, 'Keep your core tight', NULL),
(2, 1, 'Squats', 'Lower body strength', 4, 12, 90, 'Watch your knee alignment', NULL),
(3, 2, 'Burpees', 'Full body cardio', 5, 10, 45, 'Maintain proper form', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `meals`
--

CREATE TABLE `meals` (
  `meal_id` int(11) NOT NULL,
  `meal_plan_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `ingredients` text DEFAULT NULL,
  `cooking_instructions` text DEFAULT NULL,
  `calories` int(11) DEFAULT NULL,
  `protein_grams` decimal(6,2) DEFAULT NULL,
  `carbs_grams` decimal(6,2) DEFAULT NULL,
  `fats_grams` decimal(6,2) DEFAULT NULL,
  `fiber_grams` decimal(6,2) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meals`
--

INSERT INTO `meals` (`meal_id`, `meal_plan_id`, `name`, `ingredients`, `cooking_instructions`, `calories`, `protein_grams`, `carbs_grams`, `fats_grams`, `fiber_grams`, `image_url`) VALUES
(1, 1, 'Chicken Salad', 'Chicken breast, lettuce, tomatoes', 'Grill chicken and mix with fresh vegetables', 350, 35.00, 10.00, 15.00, 5.00, NULL),
(2, 2, 'Protein Smoothie', 'Whey protein, banana, milk, oats', 'Blend all ingredients until smooth', 400, 30.00, 45.00, 10.00, 4.00, NULL),
(3, 3, 'Quinoa Bowl', 'Quinoa, vegetables, tofu', 'Cook quinoa and stir-fry vegetables', 450, 20.00, 65.00, 12.00, 8.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `meal_plans`
--

CREATE TABLE `meal_plans` (
  `meal_plan_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `total_calories` int(11) DEFAULT NULL,
  `protein_grams` decimal(6,2) DEFAULT NULL,
  `carbs_grams` decimal(6,2) DEFAULT NULL,
  `fats_grams` decimal(6,2) DEFAULT NULL,
  `fiber_grams` decimal(6,2) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meal_plans`
--

INSERT INTO `meal_plans` (`meal_plan_id`, `name`, `description`, `total_calories`, `protein_grams`, `carbs_grams`, `fats_grams`, `fiber_grams`, `image_url`) VALUES
(1, 'Weight Loss Plan', 'Calorie-deficit meal plan', 1800, 150.00, 180.00, 60.00, 25.00, NULL),
(2, 'Muscle Gain', 'High protein meal plan', 2500, 200.00, 250.00, 70.00, 30.00, NULL),
(3, 'Balanced Diet', 'Maintenance meal plan', 2000, 160.00, 220.00, 65.00, 28.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `progress_tracking`
--

CREATE TABLE `progress_tracking` (
  `progress_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `strength_level` decimal(5,2) DEFAULT NULL,
  `cardio_performance` decimal(5,2) DEFAULT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `progress_tracking`
--

INSERT INTO `progress_tracking` (`progress_id`, `user_id`, `date`, `weight`, `strength_level`, `cardio_performance`, `notes`) VALUES
(1, 1, '2024-03-01', 75.50, 7.50, 8.00, 'Feeling stronger'),
(2, 2, '2024-03-01', 65.00, 6.50, 7.50, 'Improved endurance'),
(3, 3, '2024-03-01', 80.00, 8.50, 8.50, 'Personal best in lifting');

-- --------------------------------------------------------

--
-- Table structure for table `training_schedule`
--

CREATE TABLE `training_schedule` (
  `schedule_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `workout_id` int(11) DEFAULT NULL,
  `scheduled_date` date DEFAULT NULL,
  `completion_status` enum('pending','completed','missed') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `training_schedule`
--

INSERT INTO `training_schedule` (`schedule_id`, `user_id`, `workout_id`, `scheduled_date`, `completion_status`) VALUES
(1, 1, 1, '2024-03-10', 'pending'),
(2, 2, 2, '2024-03-11', 'completed'),
(3, 3, 3, '2024-03-12', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `profile_image_url` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `password_hash`, `first_name`, `last_name`, `profile_image_url`, `bio`, `created_at`, `updated_at`) VALUES
(1, 'john.doe@email.com', 'hashed_password_1', 'John', 'Doe', NULL, 'Fitness enthusiast', '2025-03-24 07:31:18', '2025-03-24 07:31:18'),
(2, 'jane.smith@email.com', 'hashed_password_2', 'Jane', 'Smith', NULL, 'Yoga lover', '2025-03-24 07:31:18', '2025-03-24 07:31:18'),
(3, 'mike.wilson@email.com', 'hashed_password_3', 'Mike', 'Wilson', NULL, 'Professional trainer', '2025-03-24 07:31:18', '2025-03-24 07:31:18'),
(4, 'user@example.com', 'hashedpassword', 'John', 'Doe', NULL, 'Fitness enthusiast', '2025-03-24 08:09:28', '2025-03-24 08:09:28');

-- --------------------------------------------------------

--
-- Table structure for table `user_goals`
--

CREATE TABLE `user_goals` (
  `goal_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `goal_type` enum('weight','strength','cardio','nutrition') DEFAULT NULL,
  `target_value` decimal(6,2) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `target_date` date DEFAULT NULL,
  `status` enum('in_progress','achieved','failed') DEFAULT 'in_progress'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_goals`
--

INSERT INTO `user_goals` (`goal_id`, `user_id`, `goal_type`, `target_value`, `start_date`, `target_date`, `status`) VALUES
(1, 1, 'weight', 70.00, '2024-03-01', '2024-06-01', 'in_progress'),
(2, 2, 'strength', 50.00, '2024-03-01', '2024-05-01', 'in_progress'),
(3, 3, 'cardio', 10.00, '2024-03-01', '2024-04-01', 'in_progress');

-- --------------------------------------------------------

--
-- Table structure for table `user_stats`
--

CREATE TABLE `user_stats` (
  `stat_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `workout_count` int(11) DEFAULT 0,
  `achievement_count` int(11) DEFAULT 0,
  `success_rate` decimal(5,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_stats`
--

INSERT INTO `user_stats` (`stat_id`, `user_id`, `workout_count`, `achievement_count`, `success_rate`) VALUES
(1, 1, 25, 5, 85.50),
(2, 2, 15, 3, 78.25),
(3, 3, 40, 8, 92.75);

-- --------------------------------------------------------

--
-- Table structure for table `workouts`
--

CREATE TABLE `workouts` (
  `workout_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `difficulty_level` enum('beginner','intermediate','advanced') DEFAULT NULL,
  `duration_minutes` int(11) DEFAULT NULL,
  `calorie_burn` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `workouts`
--

INSERT INTO `workouts` (`workout_id`, `name`, `description`, `difficulty_level`, `duration_minutes`, `calorie_burn`, `image_url`) VALUES
(1, 'Full Body Blast', 'Complete body workout for all muscle groups', 'intermediate', 45, 400, NULL),
(2, 'HIIT Cardio', 'High-intensity interval training', 'advanced', 30, 350, NULL),
(3, 'Beginner Basics', 'Introduction to fitness routine', 'beginner', 40, 250, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `achievements`
--
ALTER TABLE `achievements`
  ADD PRIMARY KEY (`achievement_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `exercises`
--
ALTER TABLE `exercises`
  ADD PRIMARY KEY (`exercise_id`),
  ADD KEY `workout_id` (`workout_id`);

--
-- Indexes for table `meals`
--
ALTER TABLE `meals`
  ADD PRIMARY KEY (`meal_id`),
  ADD KEY `meal_plan_id` (`meal_plan_id`);

--
-- Indexes for table `meal_plans`
--
ALTER TABLE `meal_plans`
  ADD PRIMARY KEY (`meal_plan_id`);

--
-- Indexes for table `progress_tracking`
--
ALTER TABLE `progress_tracking`
  ADD PRIMARY KEY (`progress_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `training_schedule`
--
ALTER TABLE `training_schedule`
  ADD PRIMARY KEY (`schedule_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `workout_id` (`workout_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_goals`
--
ALTER TABLE `user_goals`
  ADD PRIMARY KEY (`goal_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user_stats`
--
ALTER TABLE `user_stats`
  ADD PRIMARY KEY (`stat_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `workouts`
--
ALTER TABLE `workouts`
  ADD PRIMARY KEY (`workout_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `achievements`
--
ALTER TABLE `achievements`
  MODIFY `achievement_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `exercises`
--
ALTER TABLE `exercises`
  MODIFY `exercise_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `meals`
--
ALTER TABLE `meals`
  MODIFY `meal_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `meal_plans`
--
ALTER TABLE `meal_plans`
  MODIFY `meal_plan_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `progress_tracking`
--
ALTER TABLE `progress_tracking`
  MODIFY `progress_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `training_schedule`
--
ALTER TABLE `training_schedule`
  MODIFY `schedule_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_goals`
--
ALTER TABLE `user_goals`
  MODIFY `goal_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_stats`
--
ALTER TABLE `user_stats`
  MODIFY `stat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `workouts`
--
ALTER TABLE `workouts`
  MODIFY `workout_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `achievements`
--
ALTER TABLE `achievements`
  ADD CONSTRAINT `achievements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `exercises`
--
ALTER TABLE `exercises`
  ADD CONSTRAINT `exercises_ibfk_1` FOREIGN KEY (`workout_id`) REFERENCES `workouts` (`workout_id`);

--
-- Constraints for table `meals`
--
ALTER TABLE `meals`
  ADD CONSTRAINT `meals_ibfk_1` FOREIGN KEY (`meal_plan_id`) REFERENCES `meal_plans` (`meal_plan_id`);

--
-- Constraints for table `progress_tracking`
--
ALTER TABLE `progress_tracking`
  ADD CONSTRAINT `progress_tracking_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `training_schedule`
--
ALTER TABLE `training_schedule`
  ADD CONSTRAINT `training_schedule_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `training_schedule_ibfk_2` FOREIGN KEY (`workout_id`) REFERENCES `workouts` (`workout_id`);

--
-- Constraints for table `user_goals`
--
ALTER TABLE `user_goals`
  ADD CONSTRAINT `user_goals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `user_stats`
--
ALTER TABLE `user_stats`
  ADD CONSTRAINT `user_stats_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
