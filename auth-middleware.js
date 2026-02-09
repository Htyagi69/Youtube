import auth from './auth.js'
const requireAuth = async (req, res, next) => {
    try {
        const session = await auth.api.getSession({ headers: req.headers });

        if (!session?.user) {
            return res.status(401).json({
                error: 'Unauthorized',
                redirectTo: '/signin.html'
            });
        }

        req.user = session.user;
        req.session = session.session;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({ error: 'Invalid session' });
    }
}

export default requireAuth;