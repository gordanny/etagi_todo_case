from django import forms
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.forms import AuthenticationForm, ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

UserModel = get_user_model()


class CustomUserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = UserModel
        fields = ('username', 'first_name', 'last_name', 'patronymic', 'chief')

    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise ValidationError(_("Passwords don't match"))
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class CustomUserChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = UserModel
        fields = ('password', 'first_name', 'last_name', 'patronymic', 'chief', 'is_active', 'is_admin')


class CustomAuthenticationForm(AuthenticationForm):

    error_messages = {
        'invalid_login': _("A user with this login is not exist"),
        'incorrect_password': _('Incorrect password'),
        'inactive': _("This account is inactive."),
    }

    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')

        if username is not None and password:
            if UserModel.objects.filter(username=username):
                self.user_cache = authenticate(self.request, username=username, password=password)
                if self.user_cache is None:
                    raise self.get_authentication_error('incorrect_password')
                else:
                    self.confirm_login_allowed(self.user_cache)
            else:
                raise self.get_authentication_error('invalid_login')

        return self.cleaned_data

    def get_authentication_error(self, cause):
        return ValidationError(
            self.error_messages[cause],
            code=cause,
        )
