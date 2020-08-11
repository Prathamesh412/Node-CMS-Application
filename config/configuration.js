module.exports = {
    mongoDbUrl: "mongodb://admin:prath123@ds153096.mlab.com:53096/node_blog_application",
    PORT: process.env.PORT || 3000,

    globalVariables: (req, res, next) => {
        res.locals.success_message = req.flash('success-message');
        res.locals.error_message = req.flash('error-message');
        res.locals.user = req.user || null;

        next();
    }
}