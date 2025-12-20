import { connectDatabase, disconnectDatabase } from '../config/database';
import { User, Board, List, Card, Comment } from '../models';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    await connectDatabase();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Board.deleteMany({});
    await List.deleteMany({});
    await Card.deleteMany({});
    await Comment.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    const user1 = await User.create({
      email: 'john@example.com',
      password: 'password123',
      name: 'John Doe',
      bio: 'Product Manager',
    });

    const user2 = await User.create({
      email: 'jane@example.com',
      password: 'password123',
      name: 'Jane Smith',
      bio: 'Software Developer',
    });

    const user3 = await User.create({
      email: 'bob@example.com',
      password: 'password123',
      name: 'Bob Wilson',
      bio: 'Designer',
    });

    console.log(`✅ Created ${3} users`);

    // Create boards
    console.log('📋 Creating boards...');
    const board1 = await Board.create({
      title: 'Product Development',
      description: 'Main product development board',
      owner: user1._id,
      members: [user1._id, user2._id, user3._id],
      backgroundColor: '#0079BF',
    });

    const board2 = await Board.create({
      title: 'Marketing Campaign',
      description: 'Q1 Marketing initiatives',
      owner: user2._id,
      members: [user1._id, user2._id],
      backgroundColor: '#D29034',
    });

    console.log(`✅ Created ${2} boards`);

    // Create lists for board1
    console.log('📝 Creating lists...');
    const list1 = await List.create({
      title: 'To Do',
      board: board1._id,
      position: 0,
    });

    const list2 = await List.create({
      title: 'In Progress',
      board: board1._id,
      position: 1,
    });

    const list3 = await List.create({
      title: 'Done',
      board: board1._id,
      position: 2,
    });

    // Create lists for board2
    const list4 = await List.create({
      title: 'Ideas',
      board: board2._id,
      position: 0,
    });

    const list5 = await List.create({
      title: 'In Progress',
      board: board2._id,
      position: 1,
    });

    console.log(`✅ Created ${5} lists`);

    // Create cards
    console.log('🎴 Creating cards...');
    const card1 = await Card.create({
      title: 'Design new homepage',
      description: 'Create mockups for the new homepage layout',
      list: list1._id,
      position: 0,
      assignees: [user3._id],
      priority: 'high',
      labels: ['design', 'urgent'],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const card2 = await Card.create({
      title: 'Implement authentication',
      description: 'Add JWT authentication to the API',
      list: list2._id,
      position: 0,
      assignees: [user2._id],
      priority: 'high',
      labels: ['backend', 'security'],
    });

    await Card.create({
      title: 'Write unit tests',
      description: 'Increase test coverage to 80%',
      list: list1._id,
      position: 1,
      assignees: [user2._id],
      priority: 'medium',
      labels: ['testing'],
    });

    await Card.create({
      title: 'Update documentation',
      description: 'Update API documentation with new endpoints',
      list: list3._id,
      position: 0,
      assignees: [user1._id],
      priority: 'low',
      labels: ['docs'],
    });

    const card5 = await Card.create({
      title: 'Social media campaign',
      description: 'Plan and execute social media posts for product launch',
      list: list4._id,
      position: 0,
      assignees: [user1._id, user2._id],
      priority: 'high',
      labels: ['marketing', 'social'],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });

    await Card.create({
      title: 'Email newsletter',
      description: 'Design and send monthly newsletter',
      list: list5._id,
      position: 0,
      assignees: [user2._id],
      priority: 'medium',
      labels: ['marketing', 'email'],
    });

    console.log(`✅ Created ${6} cards`);

    // Create comments
    console.log('💬 Creating comments...');
    await Comment.create({
      content: 'I have started working on the mockups. Should have them ready by tomorrow.',
      card: card1._id,
      author: user3._id,
    });

    await Comment.create({
      content: 'Great! Let me know if you need any feedback.',
      card: card1._id,
      author: user1._id,
    });

    await Comment.create({
      content: 'JWT implementation is complete. Moving on to refresh tokens.',
      card: card2._id,
      author: user2._id,
    });

    await Comment.create({
      content: 'We should target the 18-35 demographic for this campaign.',
      card: card5._id,
      author: user1._id,
    });

    console.log(`✅ Created ${4} comments`);

    console.log('\n📊 Seed Summary:');
    console.log(`   Users: 3`);
    console.log(`   Boards: 2`);
    console.log(`   Lists: 5`);
    console.log(`   Cards: 6`);
    console.log(`   Comments: 4`);

    console.log('\n🔑 Test Credentials:');
    console.log(`   Email: john@example.com | Password: password123`);
    console.log(`   Email: jane@example.com | Password: password123`);
    console.log(`   Email: bob@example.com | Password: password123`);

    console.log('\n✅ Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
    process.exit(0);
  }
};

seedDatabase();
