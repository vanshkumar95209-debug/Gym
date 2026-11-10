import { Exercise, AppLanguage, MuscleGroup, EquipmentType } from '../types';

export interface FormGuide {
  title: string;
  targetMuscle: string;
  targetSubMuscle: string;
  equipment: string;
  recommendedSetsReps: string;
  
  // 1. Starting Setup & Position
  positionSetup: {
    heading: string;
    stance: string;
    grip: string;
    posture: string;
    feet: string;
  };

  // 2. Step-by-Step Execution
  executionSteps: {
    heading: string;
    step1Negative: string;
    step2Positive: string;
    tempoGuide: string;
  };

  // 3. Breathing Technique
  breathing: {
    heading: string;
    inhale: string;
    exhale: string;
    tip: string;
  };

  // 4. Mistakes to Avoid
  mistakes: {
    heading: string;
    items: string[];
  };

  // 5. Pro Tip
  proTip: {
    heading: string;
    text: string;
  };
}

// English Specific Guides for major compound movements
const EN_SPECIFIC: Record<string, Partial<FormGuide>> = {
  'chest-flat-bench-press': {
    positionSetup: {
      heading: '1. Proper Starting Setup & Body Position',
      stance: 'Lie flat on the bench with your eyes directly under the racked barbell. Pull your shoulder blades down and pinch them tightly into the bench.',
      grip: 'Grip the bar slightly wider than shoulder-width (roughly 1.5x shoulder width). Wrap your thumbs fully around the bar (safe full grip).',
      posture: 'Maintain a tight chest arch with scapulae firmly retracted. Keep your ribcage high throughout the entire set.',
      feet: 'Drive both feet flat and firmly into the gym floor to establish strong leg drive and pelvic stability.'
    },
    executionSteps: {
      heading: '2. How to Perform (Step-by-Step)',
      step1Negative: 'Unrack the bar and stabilize over mid-chest. Lower the barbell under strict 3-second control down to your lower chest (nipple line). Keep elbows tucked at a 45° to 60° angle, never flared out at 90°.',
      step2Positive: 'Press forcefully through your feet and drive the barbell vertically upward. Squeeze your pecs hard at the top without unlocking your shoulder blades.',
      tempoGuide: '3s slow controlled descent → 1s chest touch → 1s explosive upward drive.'
    },
    breathing: {
      heading: '3. Proper Breathing Technique',
      inhale: 'Take a deep breath and expand your chest while lowering the bar to your chest.',
      exhale: 'Exhale forcefully through pursed lips as you press through the sticking point to the top.',
      tip: 'Do not hold your breath during the entire set; breathe rhythmically on each rep.'
    },
    mistakes: {
      heading: '4. Common Mistakes to Avoid',
      items: [
        'Bouncing the heavy bar off your sternum or ribcage.',
        'Flaring elbows straight out at 90° (high rotator cuff injury risk).',
        'Lifting your hips and glutes off the bench during heavy presses.'
      ]
    },
    proTip: {
      heading: 'Expert Form Cue',
      text: 'Do not just think about pushing the bar up; visualize bending the bar in half and driving your biceps together across your chest.'
    }
  },

  'chest-incline-dumbbell-press': {
    positionSetup: {
      heading: '1. Proper Starting Setup & Body Position',
      stance: 'Set the bench to a 30° incline. Avoid steep angles (45°+) which recruit too much front shoulder.',
      grip: 'Kick the dumbbells up to shoulder level using your knees. Turn dumbbells slightly inward (45° semi-neutral angle).',
      posture: 'Press your upper back firmly into the bench pad, puff your chest out high, and lock shoulders back.',
      feet: 'Plant your feet wide and flat on the floor for lateral balance.'
    },
    executionSteps: {
      heading: '2. How to Perform (Step-by-Step)',
      step1Negative: 'Lower the dumbbells under strict control towards the sides of your upper chest (clavicle) until you feel a deep stretch in the upper pecs.',
      step2Positive: 'Press upward and slightly inward in a gentle triangle arc, squeezing your upper chest hard at the top. Do not bang the dumbbells together.',
      tempoGuide: '3s lowering → 1s stretch hold → 1s strong contraction upward.'
    },
    breathing: {
      heading: '3. Proper Breathing Technique',
      inhale: 'Inhale deeply as you lower the dumbbells to your chest.',
      exhale: 'Exhale steadily as you press the weights overhead.',
      tip: 'Keep your core braced during the entire movement.'
    },
    mistakes: {
      heading: '4. Common Mistakes to Avoid',
      items: [
        'Setting the bench too high (above 45°), turning it into a shoulder press.',
        'Clanking the weights together at the top, losing peak muscular tension.',
        'Short-changing the range of motion by not getting a full deep stretch at the bottom.'
      ]
    },
    proTip: {
      heading: 'Expert Form Cue',
      text: 'A 30-degree incline provides maximum upper chest clavicular fiber recruitment with minimum front delt fatigue.'
    }
  },

  'back-barbell-deadlift': {
    positionSetup: {
      heading: '1. Proper Starting Setup & Body Position',
      stance: 'Stand with feet hip-width apart. The barbell should cross over the middle of your shoelaces, 1 inch from your shins.',
      grip: 'Hinge at hips and grip the bar just outside your knees with an overhand or mixed grip.',
      posture: 'Flatten your back completely, pull your chest forward and proud, and pull your shoulder blades down into your back pockets.',
      feet: 'Distribute your weight evenly across your mid-foot and heels (tripod foot position).'
    },
    executionSteps: {
      heading: '2. How to Perform (Step-by-Step)',
      step1Negative: 'Liftoff: Push the floor away through your heels like doing a leg press. Keep the bar dragging against your shins and thighs. Lock out with glutes and hips.',
      step2Positive: 'Descent: Push your hips backward first, allowing the bar to slide down your thighs. Once past your knees, bend knees and set the bar quietly down.',
      tempoGuide: '1s explosive powerful drive → 2s controlled lowering to ground.'
    },
    breathing: {
      heading: '3. Proper Breathing Technique',
      inhale: 'Take a deep belly breath and brace your core like preparing for a punch before pulling.',
      exhale: 'Exhale powerfully once you pass the sticking point or reach the top lockout.',
      tip: 'Never lose your intra-abdominal pressure midway through a heavy pull.'
    },
    mistakes: {
      heading: '4. Common Mistakes to Avoid',
      items: [
        'Rounding your lower spine (cat-back) which risks disc herniation.',
        'Letting the barbell drift forward away from your legs.',
        'Hyperextending and leaning backward excessively at the top lockout.'
      ]
    },
    proTip: {
      heading: 'Expert Form Cue',
      text: 'Do not think of pulling the bar off the floor; think of wedging yourself between the bar and the floor and driving the earth away from you.'
    }
  },

  'legs-barbell-squat': {
    positionSetup: {
      heading: '1. Proper Starting Setup & Body Position',
      stance: 'Rest the barbell across your upper traps. Set your feet shoulder-width apart with toes flared out 15° to 30°.',
      grip: 'Grip the bar firmly, pull your elbows down toward your ribs to create a rigid upper back shelf.',
      posture: 'Keep your chest tall, gaze forward at the floor 8-10 feet ahead, and brace your abs tight.',
      feet: 'Anchor your big toe, pinky toe, and heel firmly to the floor.'
    },
    executionSteps: {
      heading: '2. How to Perform (Step-by-Step)',
      step1Negative: 'Break at your hips and knees simultaneously. Sit down and push your knees out in line with your toes until thighs are at least parallel (90°) to the floor.',
      step2Positive: 'Drive forcefully through your heels and mid-foot, driving your hips up and forward to return to standing.',
      tempoGuide: '3s controlled descent → 1s deep parallel pause → 1s strong vertical drive.'
    },
    breathing: {
      heading: '3. Proper Breathing Technique',
      inhale: 'Take a huge belly breath and brace your 360° core before initiating the squat.',
      exhale: 'Exhale forcefully as you drive past the hardest sticking point on the way up.',
      tip: 'Never breathe out at the bottom of the squat.'
    },
    mistakes: {
      heading: '4. Common Mistakes to Avoid',
      items: [
        'Knees caving inward (valgus collapse) on the ascent.',
        'Heels rising off the floor due to tight ankles or poor weight distribution.',
        'Stopping shallow (half-squats) which places excessive sheer stress on knee joints.'
      ]
    },
    proTip: {
      heading: 'Expert Form Cue',
      text: 'Imagine tearing the gym floor in half between your feet on both the descent and ascent to fully recruit your glutes.'
    }
  }
};

// Hindi Specific Guides for major movements
const HI_SPECIFIC: Record<string, Partial<FormGuide>> = {
  'chest-flat-bench-press': {
    positionSetup: {
      heading: '1. सही शुरुआती पोजीशन व मुद्रा (Starting Position)',
      stance: 'फ्लैट बेंच पर पीठ के बल लेटें। आंखें सीधे बारबेल के ठीक नीचे होनी चाहिए।',
      grip: 'बारबेल को कंधों की चौड़ाई से थोड़ा बाहर पकड़ें। अंगूठे से बार को पूरा लॉक करें।',
      posture: 'कंधों की हड्डियों को बेंच में दबाएं और कमर में हल्का आर्च बनाएं। छाती पूरी फूली हुई रहे।',
      feet: 'दोनों पैर जमीन पर सपाट और मजबूती से गड़े हों।'
    },
    executionSteps: {
      heading: '2. कसरत कैसे करें (स्टेप बाय स्टेप)',
      step1Negative: '3 सेकंड में कंट्रोल के साथ बार को लोअर चेस्ट (निप्पल लाइन) तक नीचे लाएं। कोहनी 45° से 60° के कोण पर रखें।',
      step2Positive: 'पैरों से जमीन पर दबाव बनाते हुए बारबेल को 1 सेकंड में ऊपर धकेलें। ऊपर चेस्ट को कसकर सिकोड़ें।',
      tempoGuide: '3 सेकंड धीमे नीचे → 1 सेकंड चेस्ट स्पर्श → 1 सेकंड में ऊपर धकेलें।'
    },
    breathing: {
      heading: '3. सांस लेने का सही नियम',
      inhale: 'बारबेल को नीचे लाते समय नाक से गहरी सांस अंदर भरें।',
      exhale: 'बारबेल को ऊपर धकेलते समय मुंह से सांस बाहर छोड़ें।',
      tip: 'वजन धकेलते वक्त सांस न रोकें।'
    },
    mistakes: {
      heading: '4. यह गलतियां बिल्कुल न करें',
      items: [
        'बार को सीने पर जोर से पटकना या उछालना।',
        'कोहनियों को कंधों की सीध में 90 डिग्री बाहर फैलाना।',
        'कमर को बेंच से बहुत ज्यादा ऊपर उठा देना।'
      ]
    },
    proTip: {
      heading: 'प्रो टिप',
      text: 'हमेशा सोचें कि आप बार को ऊपर नहीं फेंक रहे, बल्कि अपने दोनों बाइसेप्स को आपस में मिलाने की कोशिश कर रहे हैं।'
    }
  }
};

export function getExerciseGuide(exercise: Exercise, lang: AppLanguage): FormGuide {
  const isEn = lang === 'en';
  const specific = isEn ? EN_SPECIFIC[exercise.id] : HI_SPECIFIC[exercise.id];

  const muscleMap: Record<MuscleGroup, { en: string; hi: string }> = {
    chest: { en: 'Chest (Pectorals)', hi: 'छाती (Pecs)' },
    back: { en: 'Back (Lats & Traps)', hi: 'पीठ (Back)' },
    biceps: { en: 'Biceps', hi: 'बाइसेप्स' },
    triceps: { en: 'Triceps', hi: 'ट्राइसेप्स' },
    shoulders: { en: 'Shoulders (Delts)', hi: 'कंधे (Delts)' },
    legs: { en: 'Legs & Glutes', hi: 'पैर (Legs)' },
    abs: { en: 'Abs & Core', hi: 'पेट व कोर' }
  };

  const defaultSetupStance = isEn
    ? `Position yourself with a stable athletic base. Keep your chest up, shoulders engaged, and core braced tightly.`
    : `स्थिर और संतुलित मुद्रा में खड़े हों या बैठें। छाती तनी हुई, कंधे स्थिर और कोर की मसल्स पूरी कसी हुई रखें।`;

  const defaultSetupGrip = isEn
    ? `Hold the ${exercise.equipment} with a firm, centered grip. Keep your wrists straight and locked in neutral alignment.`
    : `${exercise.equipment} को संतुलित ग्रिप से मजबूती से पकड़ें। कलाइयों को सीधा और स्थिर रखें।`;

  const defaultSetupPosture = isEn
    ? `Maintain a neutral spine with chest held high. Retract shoulder blades to protect the shoulder joints.`
    : `रीढ़ की हड्डी को सीधा रखें, छाती बाहर निकालें और कंधों को पीछे स्थिर रखें।`;

  const defaultSetupFeet = isEn
    ? `Place feet flat on the floor shoulder-width apart to provide an immovable foundation.`
    : `दोनों पैर जमीन पर सपाट और कंधों की चौड़ाई पर रखें ताकि शरीर को पूरा संतुलन मिले।`;

  const defaultNegative = isEn
    ? `Lower the weight under a strict 2-3 second count. Emphasize a deep, controlled muscular stretch in the target ${exercise.targetMuscle}.`
    : `2 से 3 सेकंड में वजन को नियंत्रित गति से नीचे लाएं। मसल में गहरा खिंचाव महसूस करें।`;

  const defaultPositive = isEn
    ? `Drive or pull forcefully in 1 second. Squeeze the target muscle with maximum voluntary contraction at the peak.`
    : `1 सेकंड में पूरी ताकत से वजन उठाएं या खींचें। टॉप पर मसल को 1 सेकंड कसकर निचोड़ें।`;

  const defaultTempo = isEn
    ? `3s controlled eccentric lowering → 1s stretch/pause → 1s explosive concentric contraction.`
    : `3 सेकंड धीमे नीचे → 1 सेकंड खिंचाव → 1 सेकंड में संकुचन।`;

  const defaultInhale = isEn
    ? `Inhale deeply through your nose as you lower the weight or return to starting position.`
    : `वजन को नीचे लाते या खिंचाव के समय नाक से गहरी सांस अंदर लें।`;

  const defaultExhale = isEn
    ? `Exhale smoothly through your mouth as you push, pull, or exert maximum effort.`
    : `वजन को उठाते या जोर लगाते समय मुंह से सांस बाहर छोड़ें।`;

  const defaultBreathingTip = isEn
    ? `Never hold your breath during resistance training; rhythmic breathing prevents blood pressure spikes.`
    : `कसरत के दौरान कभी भी सांस न रोकें, सामान्य और गहरी सांस बनाए रखें।`;

  const defaultMistakes = isEn
    ? [
        `Using momentum, swinging, or jerking the weight instead of using muscle strength.`,
        `Sacrificing full range of motion to lift weights that are too heavy for your form.`,
        `Rounding the back or losing core tension during the repetition.`
      ]
    : [
        `वजन को झटके के साथ उठाना या गिराना।`,
        `भारी वजन उठाने के चक्कर में गलत फॉर्म में कसरत करना।`,
        `कमर को मोड़ना या कोर को ढीला छोड़ देना।`
      ];

  const defaultProTip = isEn
    ? `Focus on the mind-muscle connection. Consciously feel the ${exercise.targetSubMuscle || exercise.targetMuscle} contract on every single rep.`
    : `माइंड-मसल कनेक्शन पर ध्यान दें। हर रेप में उस मांसपेशी के खिंचाव और संकुचन को महसूस करें।`;

  return {
    title: isEn ? exercise.name : exercise.hindiName,
    targetMuscle: isEn ? muscleMap[exercise.targetMuscle].en : muscleMap[exercise.targetMuscle].hi,
    targetSubMuscle: exercise.targetSubMuscle,
    equipment: exercise.equipment,
    recommendedSetsReps: exercise.defaultSetsReps,

    positionSetup: {
      heading: isEn ? '1. Proper Starting Setup & Body Position' : '1. सही शुरुआती पोजीशन व मुद्रा',
      stance: specific?.positionSetup?.stance || defaultSetupStance,
      grip: specific?.positionSetup?.grip || defaultSetupGrip,
      posture: specific?.positionSetup?.posture || defaultSetupPosture,
      feet: specific?.positionSetup?.feet || defaultSetupFeet
    },

    executionSteps: {
      heading: isEn ? '2. How to Perform (Step-by-Step)' : '2. कसरत कैसे करें (स्टेप बाय स्टेप)',
      step1Negative: specific?.executionSteps?.step1Negative || defaultNegative,
      step2Positive: specific?.executionSteps?.step2Positive || defaultPositive,
      tempoGuide: specific?.executionSteps?.tempoGuide || defaultTempo
    },

    breathing: {
      heading: isEn ? '3. Proper Breathing Technique' : '3. सांस लेने का सही नियम',
      inhale: specific?.breathing?.inhale || defaultInhale,
      exhale: specific?.breathing?.exhale || defaultExhale,
      tip: specific?.breathing?.tip || defaultBreathingTip
    },

    mistakes: {
      heading: isEn ? '4. Common Mistakes to Avoid' : '4. यह गलतियां बिल्कुल न करें',
      items: specific?.mistakes?.items || defaultMistakes
    },

    proTip: {
      heading: isEn ? 'Expert Form Tip' : 'प्रो टिप',
      text: specific?.proTip?.text || defaultProTip
    }
  };
}
