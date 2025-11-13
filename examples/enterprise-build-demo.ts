async function demonstrateEnterpriseBuild() {
  console.log('🏗️  .enterprise Build System Demo\n');

  try {
    // Dynamic import to avoid build issues
    const enterpriseModule = await import('@skygenesisenterprise/enterprise-node');
    const EnterpriseBuilder = (enterpriseModule as any).EnterpriseBuilder;

    // Create builder with auto-detected framework
    const builder = await EnterpriseBuilder.create({
      mode: 'production',
      environment: 'production',
      version: '1.0.0',
    });

    console.log('📋 Builder created with configuration:');
    console.log('- Mode: production');
    console.log('- Environment: production');
    console.log('- Version: 1.0.0');

    // Build project
    console.log('\n🔨 Building project...');
    await builder.build();

    // Get build information
    const info = await builder.getInfo();
    console.log('\n📊 Build Information:');
    console.log(`- Total artifacts: ${info.totalArtifacts}`);
    console.log(`- Last build: ${info.lastBuild}`);

    console.log('\n✅ .enterprise build system demo completed!');
    console.log('\n📁 Check .enterprise/ directory to see build artifacts.');
  } catch (error) {
    console.error('❌ Demo failed:', error);
  }
}

// Run demo
demonstrateEnterpriseBuild().catch(console.error);
