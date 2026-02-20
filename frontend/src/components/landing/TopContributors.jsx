import { FaMedal, FaTrophy } from 'react-icons/fa';

const contributors = [
    {
        name: "Rahul Sharma",
        points: 2450,
        badge: "Swachhata Warrior",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
        rank: 1
    },
    {
        name: "Priya Singh",
        points: 1980,
        badge: "Eco Champion",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        rank: 2
    },
    {
        name: "Amit Patel",
        points: 1750,
        badge: "Green Guardian",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit",
        rank: 3
    }
];

const TopContributors = () => {
    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center justify-center gap-3">
                        <FaTrophy className="text-yellow-500" />
                        Citizen Hall of Fame
                    </h2>
                    <p className="mt-4 text-slate-600 dark:text-slate-400">
                        Celebrating our top contributors who are leading the change.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {contributors.map((user) => (
                        <div key={user.rank} className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border ${user.rank === 1 ? 'border-yellow-400 scale-105 z-10' : 'border-slate-100 dark:border-slate-700'}`}>
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full bg-slate-100" />
                                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold border-2 border-white ${user.rank === 1 ? 'bg-yellow-500' : user.rank === 2 ? 'bg-slate-400' : 'bg-orange-600'}`}>
                                        #{user.rank}
                                    </div>
                                </div>

                                <h3 className="mt-4 text-lg font-bold text-slate-800 dark:text-white">{user.name}</h3>
                                <span className="text-xs font-semibold px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full mt-2">
                                    {user.badge}
                                </span>

                                <div className="mt-4 flex items-center space-x-2 text-slate-500">
                                    <FaMedal className="text-saffron-500" />
                                    <span className="font-bold text-slate-900 dark:text-white">{user.points}</span>
                                    <span className="text-sm">points</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TopContributors;
