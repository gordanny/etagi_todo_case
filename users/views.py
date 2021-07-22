from django.contrib.auth.views import LoginView, LogoutView
from django.shortcuts import resolve_url


from .forms import CustomAuthenticationForm


class CustomLoginView(LoginView):
    form_class = CustomAuthenticationForm
    template_name = 'todo/login.html'
    redirect_authenticated_user = True

    def get_success_url(self):
        return resolve_url('/')


def logout(request):
    login_url = resolve_url('users:login')
    return LogoutView.as_view(next_page=login_url)(request)
