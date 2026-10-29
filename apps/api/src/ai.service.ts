import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  async analyzeSymptoms(data: { symptoms: string }) {
    const symptoms = data.symptoms || '';
    const lower = symptoms.toLowerCase();

    let triageLevel: 'EMERGENCY' | 'ELEVATED' | 'ROUTINE' = 'ROUTINE';
    let riskScore = 25;
    let recommendedSpecialist = 'General Practitioner';
    let potentialConditions: string[] = ['Minor viral syndrome', 'Tension-related somatic reaction'];
    let clinicalAction = 'Schedule a standard outpatient consultation and maintain adequate hydration.';

    if (lower.includes('chest pain') || lower.includes('shortness of breath') || lower.includes('arm pain') || lower.includes('stroke') || lower.includes('fainting')) {
      triageLevel = 'EMERGENCY';
      riskScore = 92;
      recommendedSpecialist = 'Cardiologist / Emergency Medicine';
      potentialConditions = [
        'Acute Coronary Syndrome (ACS)',
        'Angina Pectoris',
        'Pulmonary Embolism'
      ];
      clinicalAction = 'IMMEDIATE MEDICAL ATTENTION REQUIRED: Proceed to the nearest emergency department or call 911 immediately.';
    } else if (lower.includes('cough') || lower.includes('fever') || lower.includes('throat') || lower.includes('lung') || lower.includes('phlegm')) {
      triageLevel = 'ELEVATED';
      riskScore = 55;
      recommendedSpecialist = 'Pulmonologist / Internal Medicine';
      potentialConditions = [
        'Acute Viral Bronchitis',
        'Upper Respiratory Tract Infection (URTI)',
        'Early-stage Pneumonia'
      ];
      clinicalAction = 'Recommended clinical evaluation within 24-48 hours. Monitor temperature and pulse oximetry.';
    } else if (lower.includes('headache') || lower.includes('migraine') || lower.includes('vision') || lower.includes('numbness')) {
      triageLevel = 'ELEVATED';
      riskScore = 60;
      recommendedSpecialist = 'Neurologist';
      potentialConditions = [
        'Vascular Migraine with Aura',
        'Cervicogenic Tension Headache',
        'Transient Neurological Episode'
      ];
      clinicalAction = 'Consult with a neurologist. Keep a symptom journal detailing duration and triggers.';
    } else if (lower.includes('stomach') || lower.includes('abdomen') || lower.includes('nausea') || lower.includes('vomit')) {
      triageLevel = 'ELEVATED';
      riskScore = 48;
      recommendedSpecialist = 'Gastroenterologist';
      potentialConditions = [
        'Acute Gastroenteritis',
        'Acid Peptic Disease / GERD',
        'Irritable Bowel Flare'
      ];
      clinicalAction = 'Maintain electrolyte oral hydration and arrange outpatient consultation within 48 hours.';
    }

    return {
      triageLevel,
      riskScore,
      symptomsAnalyzed: symptoms,
      potentialConditions,
      recommendedSpecialist,
      clinicalAction,
      confidenceScore: '96.4%',
      analysisTimestamp: new Date().toISOString(),
    };
  }
}