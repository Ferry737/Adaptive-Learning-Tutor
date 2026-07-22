import { PrismaClient, ProviderType } from '@prisma/client'
import * as crypto from 'crypto'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ============================================================================
  // Create target exams
  // ============================================================================
  console.log('Creating target exams...')
  const ebaExam = await prisma.targetExam.upsert({
    where: { name: 'EBA' },
    update: {},
    create: {
      name: 'EBA',
      description: 'Multicheck Examination for Vocational Education',
      isActive: true,
      passingScore: 50,
      maxScore: 100,
    },
  })

  const waExam = await prisma.targetExam.upsert({
    where: { name: 'Wirtschaft und Administration' },
    update: {},
    create: {
      name: 'Wirtschaft und Administration',
      description: 'Economic and Administrative Certification',
      isActive: true,
      passingScore: 50,
      maxScore: 100,
    },
  })

  const kaEbaExam = await prisma.targetExam.upsert({
    where: { name: 'Kaufmann/Kauffrau EBA' },
    update: {},
    create: {
      name: 'Kaufmann/Kauffrau EBA',
      description: 'KA EBA Certification',
      isActive: true,
      passingScore: 50,
      maxScore: 100,
    },
  })

  const kaEfzExam = await prisma.targetExam.upsert({
    where: { name: 'Kaufmann/Kauffrau EFZ' },
    update: {},
    create: {
      name: 'Kaufmann/Kauffrau EFZ',
      description: 'KA EFZ Certification',
      isActive: true,
      passingScore: 50,
      maxScore: 100,
    },
  })

  console.log('  ✓ EBA exam created')
  console.log('  ✓ Wirtschaft und Administration exam created')
  console.log('  ✓ Kaufmann/Kauffrau EBA exam created')
  console.log('  ✓ Kaufmann/Kauffrau EFZ exam created')

  // ============================================================================
  // Create curriculum sources
  // ============================================================================
  console.log('\nCreating curriculum sources...')

  const zhLehrplanSource = await prisma.curriculumSource.upsert({
    where: { title: 'Lehrplan 21 Zurich' },
    update: {},
    create: {
      title: 'Lehrplan 21 Zurich',
      url: 'https://zh.lehrplan.ch/',
      accessDate: new Date(),
      claimStatus: 'official-confirmed',
      sourceType: 'official',
      reviewerId: 'system',
      reviewedAt: new Date(),
      reviewedBy: 'system',
    },
  })

  const mathLehrplanSource = await prisma.curriculumSource.upsert({
    where: { title: 'Lehrplan 21 Mathematics' },
    update: {},
    create: {
      title: 'Lehrplan 21 Mathematics',
      url: 'https://zh.lehrplan.ch/index.php?code=b%7C5%7C0',
      accessDate: new Date(),
      claimStatus: 'official-confirmed',
      sourceType: 'official',
      reviewerId: 'system',
      reviewedAt: new Date(),
      reviewedBy: 'system',
    },
  })

  const gatewayOneSource = await prisma.curriculumSource.upsert({
    where: { title: 'gateway.one Multicheck' },
    update: {},
    create: {
      title: 'gateway.one Multiccheck',
      url: 'https://www.gateway.one/de-CH/multicheck-interpretieren.html',
      accessDate: new Date(),
      claimStatus: 'official-confirmed',
      sourceType: 'official',
      reviewerId: 'system',
      reviewedAt: new Date(),
      reviewedBy: 'system',
    },
  })

  console.log('  ✓ Lehrplan 21 Zurich source created')
  console.log('  ✓ Lehrplan 21 Mathematics source created')
  console.log('  ✓ gateway.one Multicheck source created')

  // ============================================================================
  // Create domains (Zurich Lehrplan 21)
  // ============================================================================
  console.log('\nCreating domains...')

  const domains = [
    { code: 'ZH-5-0', name: 'Zahl und Variable', category: 'mathematics' },
    { code: 'ZH-5-1', name: 'Form und Raum', category: 'mathematics' },
    { code: 'ZH-5-2', name: 'Grössen, Funktionen, Daten und Zufall', category: 'mathematics' },
    { code: 'ZH-5-3', name: 'Deutsch: Lesen', category: 'german' },
    { code: 'ZH-5-4', name: 'Deutsch: Grammatik', category: 'german' },
  ]

  const createdDomains = new Map<string, typeof domains[0]>()

  for (const domainData of domains) {
    const domain = await prisma.domain.upsert({
      where: { code: domainData.code },
      update: {},
      create: {
        ...domainData,
        sourceId: zhLehrplanSource.id,
        mappingStatus: 'official-confirmed',
      },
    })
    createdDomains.set(domain.code, domain)
    console.log(`  ✓ ${domain.name} (${domain.code}) created`)
  }

  // ============================================================================
  // Create skills (Mathematics first)
  // ============================================================================
  console.log('\nCreating skills...')

  // Arithmetic (from Zahl und Variable)
  const arithmeticSkill = await prisma.skill.create({
    data: {
      code: 'MATH-01',
      name: 'Arithmetic',
      domainId: createdDomains.get('ZH-5-0')!.id,
      difficultyLevel: 1,
      releaseStatus: 'released',
      versionId: mathLehrplanSource.id,
    },
  })
  console.log(`  ✓ ${arithmeticSkill.name} (${arithmeticSkill.code}) created`)

  // Fractions and decimals
  const fractionsSkill = await prisma.skill.create({
    data: {
      code: 'MATH-02',
      name: 'Fractions and Decimals',
      domainId: createdDomains.get('ZH-5-0')!.id,
      difficultyLevel: 2,
      releaseStatus: 'released',
      versionId: mathLehrplanSource.id,
    },
  })
  console.log(`  ✓ ${fractionsSkill.name} (${fractionsSkill.code}) created`)

  // Percentages
  const percentagesSkill = await prisma.skill.create({
    data: {
      code: 'MATH-03',
      name: 'Percentages and Proportions',
      domainId: createdDomains.get('ZH-5-0')!.id,
      difficultyLevel: 2,
      releaseStatus: 'released',
      versionId: mathLehrplanSource.id,
    },
  })
  console.log(`  ✓ ${percentagesSkill.name} (${percentagesSkill.code}) created`)

  // Geometry
  const geometrySkill = await prisma.skill.create({
    data: {
      code: 'MATH-04',
      name: 'Geometry',
      domainId: createdDomains.get('ZH-5-1')!.id,
      difficultyLevel: 3,
      releaseStatus: 'released',
      versionId: mathLehrplanSource.id,
    },
  })
  console.log(`  ✓ ${geometrySkill.name} (${geometrySkill.code}) created`)

  // Algebra
  const algebraSkill = await prisma.skill.create({
    data: {
      code: 'MATH-05',
      name: 'Algebra and Patterns',
      domainId: createdDomains.get('ZH-5-0')!.id,
      difficultyLevel: 4,
      releaseStatus: 'released',
      versionId: mathLehrplanSource.id,
    },
  })
  console.log(`  ✓ ${algebraSkill.name} (${algebraSkill.code}) created`)

  // Data
  const dataSkill = await prisma.skill.create({
    data: {
      code: 'MATH-06',
      name: 'Data and Applied Mathematics',
      domainId: createdDomains.get('ZH-5-2')!.id,
      difficultyLevel: 4,
      releaseStatus: 'released',
      versionId: mathLehrplanSource.id,
    },
  })
  console.log(`  ✓ ${dataSkill.name} (${dataSkill.code}) created`)

  // German Reading
  const germanReadingSkill = await prisma.skill.create({
    data: {
      code: 'GER-01',
      name: 'German Reading',
      domainId: createdDomains.get('ZH-5-3')!.id,
      difficultyLevel: 1,
      releaseStatus: 'released',
      versionId: zhLehrplanSource.id,
    },
  })
  console.log(`  ✓ ${germanReadingSkill.name} (${germanReadingSkill.code}) created`)

  // German Grammar
  const germanGrammarSkill = await prisma.skill.create({
    data: {
      code: 'GER-02',
      name: 'German Grammar',
      domainId: createdDomains.get('ZH-5-4')!.id,
      difficultyLevel: 2,
      releaseStatus: 'released',
      versionId: zhLehrplanSource.id,
    },
  })
  console.log(`  ✓ ${germanGrammarSkill.name} (${germanGrammarSkill.code}) created`)

  // Logic (minimal for first diagnostic)
  const logicSkill = await prisma.skill.create({
    data: {
      code: 'LOG-01',
      name: 'Logic and Critical Thinking',
      domainId: createdDomains.get('ZH-5-0')!.id,
      difficultyLevel: 2,
      releaseStatus: 'released',
      versionId: mathLehrplanSource.id,
    },
  })
  console.log(`  ✓ ${logicSkill.name} (${logicSkill.code}) created`)

  // Create skill dependencies
  console.log('\nCreating skill dependencies...')

  await prisma.skillDependency.create({
    data: {
      skillId: arithmeticSkill.id,
      dependsOn: logicSkill.id,
      order: 0,
    },
  })
  console.log('  ✓ Arithmetic depends on Logic')

  await prisma.skillDependency.create({
    data: {
      skillId: fractionsSkill.id,
      dependsOn: arithmeticSkill.id,
      order: 0,
    },
  })
  console.log('  ✓ Fractions depends on Arithmetic')

  await prisma.skillDependency.create({
    data: {
      skillId: percentagesSkill.id,
      dependsOn: fractionsSkill.id,
      order: 0,
    },
  })
  console.log('  ✓ Percentages depends on Fractions')

  await prisma.skillDependency.create({
    data: {
      skillId: geometrySkill.id,
      dependsOn: fractionsSkill.id,
      order: 0,
    },
  })
  console.log('  ✓ Geometry depends on Fractions')

  await prisma.skillDependency.create({
    data: {
      skillId: algebraSkill.id,
      dependsOn: percentagesSkill.id,
      order: 0,
    },
  })
  console.log('  ✓ Algebra depends on Percentages')

  await prisma.skillDependency.create({
    data: {
      skillId: dataSkill.id,
      dependsOn: algebraSkill.id,
      order: 0,
    },
  })
  console.log('  ✓ Data depends on Algebra')

  // ============================================================================
  // Create curriculum version for mathematics
  // ============================================================================
  console.log('\nCreating curriculum version...')

  const mathVersion = await prisma.curriculumVersion.create({
    data: {
      sourceId: mathLehrplanSource.id,
      version: '1.0.0',
      name: 'Mathematics Foundation - First Release',
      description: 'Core mathematics skills for apprenticeship preparation',
      releaseStatus: 'released',
      domainIds: JSON.stringify(['ZH-5-0', 'ZH-5-1', 'ZH-5-2']),
      skillIds: JSON.stringify(['MATH-01', 'MATH-02', 'MATH-03', 'MATH-04', 'MATH-05', 'MATH-06']),
      reviewerId: 'system',
      reviewedAt: new Date(),
      reviewedBy: 'system',
    },
  })
  console.log(`  ✓ ${mathVersion.name} v${mathVersion.version} released`)

  // Update skills to reference this version
  await prisma.skill.updateMany({
    where: {
      code: { in: ['MATH-01', 'MATH-02', 'MATH-03', 'MATH-04', 'MATH-05', 'MATH-06'] },
    },
    data: {
      versionId: mathVersion.id,
    },
  })

  // ============================================================================
  // Create curriculum version for German
  // ============================================================================
  const germanVersion = await prisma.curriculumVersion.create({
    data: {
      sourceId: zhLehrplanSource.id,
      version: '1.0.0',
      name: 'German Foundation - First Release',
      description: 'Core German reading and grammar skills for apprenticeship preparation',
      releaseStatus: 'released',
      domainIds: JSON.stringify(['ZH-5-3', 'ZH-5-4']),
      skillIds: JSON.stringify(['GER-01', 'GER-02']),
      reviewerId: 'system',
      reviewedAt: new Date(),
      reviewedBy: 'system',
    },
  })
  console.log(`  ✓ ${germanVersion.name} v${germanVersion.version} released`)

  // Update German skills to reference this version
  await prisma.skill.updateMany({
    where: {
      code: { in: ['GER-01', 'GER-02'] },
    },
    data: {
      versionId: germanVersion.id,
    },
  })

  // ============================================================================
  // Create target occupations
  // ============================================================================
  console.log('\nCreating target occupations...')

  const kaEbaOccupation = await prisma.targetOccupation.create({
    data: {
      name: 'Kaufmann/Kauffrau',
      title: 'Kaufmann/Kauffrau (KA-EBA)',
      level: 'EBA',
      isActive: true,
    },
  })
  console.log(`  ✓ ${kaEbaOccupation.title} created`)

  const kaEfzOccupation = await prisma.targetOccupation.create({
    data: {
      name: 'Kaufmann/Kauffrau EFZ',
      title: 'Kaufmann/Kauffrau (KA-EFZ)',
      level: 'EFZ',
      isActive: true,
    },
  })
  console.log(`  ✓ ${kaEfzOccupation.title} created`)

  // ============================================================================
  // Create sample generated questions (minimal for first slice)
  // ============================================================================
  console.log('\nCreating sample questions...')

  const sampleQuestions = [
    {
      template: arithmeticSkill.id,
      generatorModel: 'mock-model-v1',
      promptVersion: '1.0',
      targetDifficulty: 1,
      expectedAnswer: '7',
      rubric: JSON.stringify({
        precision: 0.1,
        units: '',
      }),
      validationStatus: 'passed',
      isOfficial: false,
      hasBeenShown: false,
    },
    {
      template: percentagesSkill.id,
      generatorModel: 'mock-model-v1',
      promptVersion: '1.0',
      targetDifficulty: 2,
      expectedAnswer: '30',
      rubric: JSON.stringify({
        precision: 0.1,
        units: '%',
      }),
      validationStatus: 'passed',
      isOfficial: false,
      hasBeenShown: false,
    },
    {
      template: germanReadingSkill.id,
      generatorModel: 'mock-model-v1',
      promptVersion: '1.0',
      targetDifficulty: 1,
      expectedAnswer: '',
      rubric: JSON.stringify({
        textAnalysis: true,
      }),
      validationStatus: 'passed',
      isOfficial: false,
      hasBeenShown: false,
    },
    {
      template: germanGrammarSkill.id,
      generatorModel: 'mock-model-v1',
      promptVersion: '1.0',
      targetDifficulty: 2,
      expectedAnswer: '',
      rubric: JSON.stringify({
        grammarCorrectness: true,
      }),
      validationStatus: 'passed',
      isOfficial: false,
      hasBeenShown: false,
    },
  ]

  const generatedQuestions = []
  for (const q of sampleQuestions) {
    const question = await prisma.generatedQuestion.create({
      data: q,
    })
    generatedQuestions.push(question)

    // Create corresponding activity
    const activity = await prisma.activity.create({
      data: {
        questionId: question.id,
        type: 'practice',
        mode: 'study',
        isAssisted: true,
        isTimed: false,
        difficulty: q.targetDifficulty,
        releaseStatus: 'released',
        versionId: mathVersion.id,
      },
    })
    console.log(`  ✓ Activity created for ${question.id}`)
  }

  // ============================================================================
  // Create sample mock exam structure
  // ============================================================================
  console.log('\nCreating mock exam structure...')

  const foundationExam = await prisma.mockExam.create({
    data: {
      name: 'Foundation Diagnostic',
      description: 'First diagnostic exam to assess current level',
      sections: JSON.stringify([
        { title: 'Mathematics - Arithmetic', questionCount: 5, timeLimit: 300 },
        { title: 'German - Reading', questionCount: 3, timeLimit: 300 },
      ]),
      totalQuestions: 8,
      timeLimit: 600,
      releaseStatus: 'released',
    },
  })
  console.log(`  ✓ ${foundationExam.name} created`)

  const foundationSections = [
    { examId: foundationExam.id, title: 'Mathematics - Arithmetic', questionCount: 5, timeLimit: 300, order: 0 },
    { examId: foundationExam.id, title: 'German - Reading', questionCount: 3, timeLimit: 300, order: 1 },
  ]

  for (const section of foundationSections) {
    const mockSection = await prisma.mockExamSection.create({
      data: section,
    })
    console.log(`  ✓ Section created: ${section.title}`)
  }

  // ============================================================================
  // Create default provider configuration (mock)
  // ============================================================================
  console.log('\nCreating provider configuration...')

  const mockProvider = await prisma.providerConfiguration.create({
    data: {
      name: 'Mock Provider',
      providerType: 'mock' as ProviderType,
      apiKey: crypto.randomBytes(32).toString('hex'),
      timeout: 30000,
      isActive: true,
    },
  })
  console.log(`  ✓ ${mockProvider.name} created`)

  // ============================================================================
  // Create sample users for testing
  // ============================================================================
  console.log('\nCreating sample users...')

  const passwordHash = await crypto
    .createHash('sha256')
    .update('password123')
    .digest('hex')

  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      emailVerified: new Date(),
      passwordHash,
      name: 'Test Learner',
    },
  })
  console.log(`  ✓ Test user created: ${testUser.email}`)

  const learnerProfile = await prisma.learnerProfile.create({
    data: {
      userId: testUser.id,
      targetExam: 'EBA only',
      targetOccupation: kaEbaOccupation.name,
      studyPlanId: null,
      preferredSecondLanguage: 'de',
      intendedExamDate: '2026-12-01',
      minutesPerDay: 20,
      interfaceLanguage: 'en',
      explanationLanguage: 'en',
      weakAreas: 'MATH-01',
    },
  })
  console.log(`  ✓ Learner profile created`)

  console.log('\n✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
